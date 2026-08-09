import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import AdmZip from 'adm-zip';

function safeName(value = 'import') {
  const cleaned = path.basename(value).replace(/[^A-Za-z0-9._ -]/g, '_').replace(/\s+/g, '-');
  return cleaned || 'import';
}

function safeRelative(value = '') {
  const normalized = String(value).replaceAll('\\', '/').replace(/^\/+/, '');
  const parts = normalized.split('/').filter((part) => part && part !== '.');
  if (parts.some((part) => part === '..')) throw new Error(`Unsafe archive path: ${value}`);
  return parts.join('/');
}

export async function importRawFile({ projectsDir, fileName, buffer }) {
  await fs.mkdir(path.join(projectsDir, '_imports'), { recursive: true });
  const ext = path.extname(fileName).toLowerCase();
  if (ext === '.json') {
    const target = path.join(projectsDir, '_imports', `${Date.now()}-${safeName(fileName)}`);
    await fs.writeFile(target, buffer);
    return { type: 'json', target };
  }
  if (ext !== '.zip') throw new Error('Only .zip and .json imports are supported.');

  const base = safeName(path.basename(fileName, ext));
  const targetRoot = path.join(projectsDir, '_imports', `${base}-${Date.now()}`);
  await fs.mkdir(targetRoot, { recursive: true });
  const zip = new AdmZip(buffer);
  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;
    const relative = safeRelative(entry.entryName);
    if (!relative) continue;
    const target = path.resolve(targetRoot, relative);
    if (!target.startsWith(`${path.resolve(targetRoot)}${path.sep}`)) throw new Error('Archive attempted path traversal.');
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, entry.getData());
  }
  return { type: 'zip', target: targetRoot };
}

export async function importFolderPayload({ projectsDir, folderName, files }) {
  const safeFolder = safeName(folderName || 'folder');
  const targetRoot = path.join(projectsDir, '_imports', `${safeFolder}-${Date.now()}`);
  await fs.mkdir(targetRoot, { recursive: true });

  let bytes = 0;
  for (const file of files || []) {
    const relative = safeRelative(file.path || file.name || '');
    if (!relative) continue;
    const data = Buffer.from(file.base64 || '', 'base64');
    bytes += data.length;
    if (bytes > 150 * 1024 * 1024) throw new Error('Folder import is larger than 150 MiB.');
    const target = path.resolve(targetRoot, relative);
    if (!target.startsWith(`${path.resolve(targetRoot)}${path.sep}`)) throw new Error('Folder attempted path traversal.');
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, data);
  }

  return { type: 'folder', target: targetRoot, fileCount: files?.length || 0 };
}
