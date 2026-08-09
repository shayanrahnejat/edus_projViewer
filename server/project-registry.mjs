import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.css', '.md', '.mdx', '.json', '.txt']);
const BINARY_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.mp3', '.wav', '.mp4', '.webm', '.pdf']);
const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.cache']);

function normalize(input = '') {
  return String(input).replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/+/g, '/');
}

function projectId(sourceType, value) {
  return crypto.createHash('sha1').update(`${sourceType}:${value}`).digest('hex').slice(0, 16);
}

async function exists(target) {
  try { await fs.access(target); return true; } catch (_) { return false; }
}

async function isDirectory(target) {
  try { return (await fs.stat(target)).isDirectory(); } catch (_) { return false; }
}

async function canonicalShape(directory) {
  const names = await fs.readdir(directory).catch(() => []);
  const lower = new Set(names.map((name) => name.toLowerCase()));
  const cdeDirs = ['app', 'component', 'components', 'core', 'page', 'pages'];
  return cdeDirs.some((name) => lower.has(name)) && (lower.has('app') || lower.has('core') || lower.has('component') || lower.has('page'));
}

async function walkDirectories(root, maxDepth = 4) {
  const output = [];
  async function visit(dir, depth) {
    if (depth > maxDepth) return;
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isDirectory() || IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      output.push(full);
      await visit(full, depth + 1);
    }
  }
  await visit(root, 0);
  return output;
}

async function readProjectFiles(root) {
  const output = [];
  async function visit(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (entry.name.startsWith('.') || IGNORED_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await visit(full);
        continue;
      }
      if (!entry.isFile()) continue;
      const rel = normalize(path.relative(root, full));
      const ext = path.extname(entry.name).toLowerCase();
      if (SOURCE_EXTENSIONS.has(ext)) {
        output.push({ name: rel, code: await fs.readFile(full, 'utf8'), binary: false });
      } else if (BINARY_EXTENSIONS.has(ext)) {
        output.push({ name: rel, binary: true });
      }
    }
  }
  await visit(root);
  return output;
}

function collectJsonFileObjects(value, output, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const item of value) collectJsonFileObjects(item, output, seen);
    return;
  }
  if (typeof value.name === 'string' && typeof value.code === 'string') {
    output.push({ name: normalize(value.name), code: value.code, binary: false });
  }
  for (const item of Object.values(value)) collectJsonFileObjects(item, output, seen);
}

async function jsonCandidate(filePath, projectsDir) {
  try {
    const parsed = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const files = [];
    collectJsonFileObjects(parsed, files);
    const unique = new Map(files.map((file) => [file.name, file]));
    const sourceCount = [...unique.values()].filter((file) => /\.(js|jsx|mjs|cjs|ts|tsx|css)$/i.test(file.name)).length;
    if (!sourceCount) return null;
    return {
      id: projectId('json', filePath),
      name: path.basename(filePath, path.extname(filePath)),
      sourceType: 'json',
      root: filePath,
      relativeRoot: normalize(path.relative(projectsDir, filePath)),
      files: [...unique.values()],
    };
  } catch (_) { return null; }
}

export class ProjectRegistry {
  constructor(projectsDir) {
    this.projectsDir = path.resolve(projectsDir);
    this.projects = new Map();
  }

  async scan() {
    await fs.mkdir(this.projectsDir, { recursive: true });
    const candidates = [];
    const allDirs = [this.projectsDir, ...(await walkDirectories(this.projectsDir, 8))];
    const acceptedRoots = [];

    for (const directory of allDirs) {
      if (!(await isDirectory(directory))) continue;
      if (!(await canonicalShape(directory))) continue;
      if (acceptedRoots.some((root) => directory.startsWith(`${root}${path.sep}`))) continue;
      acceptedRoots.push(directory);
      const files = await readProjectFiles(directory);
      candidates.push({
        id: projectId('folder', directory),
        name: path.basename(directory),
        sourceType: 'folder',
        root: directory,
        relativeRoot: normalize(path.relative(this.projectsDir, directory)) || '.',
        files,
      });
    }

    for (const directory of allDirs) {
      const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
      for (const entry of entries) {
        if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== '.json') continue;
        const full = path.join(directory, entry.name);
        if (acceptedRoots.some((root) => full.startsWith(`${root}${path.sep}`))) continue;
        const candidate = await jsonCandidate(full, this.projectsDir);
        if (candidate) candidates.push(candidate);
      }
    }

    this.projects = new Map(candidates.map((candidate) => [candidate.id, candidate]));
    return this.list();
  }

  list() {
    return [...this.projects.values()]
      .map((project) => ({
        id: project.id,
        name: project.name,
        sourceType: project.sourceType,
        relativeRoot: project.relativeRoot,
        fileCount: project.files.length,
        sourceCount: project.files.filter((file) => /\.(js|jsx|mjs|cjs|ts|tsx|css)$/i.test(file.name)).length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'en'));
  }

  get(id) { return this.projects.get(id) || null; }

  async refreshProject(id) {
    const project = this.get(id);
    if (!project) return null;
    if (project.sourceType === 'folder') project.files = await readProjectFiles(project.root);
    else if (project.sourceType === 'json') {
      const fresh = await jsonCandidate(project.root, this.projectsDir);
      if (fresh) project.files = fresh.files;
    }
    return project;
  }

  async manifest(project) {
    if (!project || project.sourceType !== 'folder') return {};
    const manifestPath = path.join(project.root, 'cde.project.json');
    if (!(await exists(manifestPath))) return {};
    try { return JSON.parse(await fs.readFile(manifestPath, 'utf8')); } catch (_) { return {}; }
  }

  async readTextFile(project, relativePath) {
    if (!project) throw new Error('Project not found.');
    const normalized = normalize(relativePath);
    if (project.sourceType === 'json') {
      const file = project.files.find((item) => item.name === normalized && !item.binary);
      if (!file) throw new Error('File not found.');
      return file.code;
    }
    const full = path.resolve(project.root, normalized);
    if (!(full === project.root || full.startsWith(`${project.root}${path.sep}`))) throw new Error('Unsafe path.');
    return fs.readFile(full, 'utf8');
  }

  resolveAsset(project, relativePath) {
    if (!project || project.sourceType !== 'folder') return null;
    const full = path.resolve(project.root, normalize(relativePath));
    if (!(full === project.root || full.startsWith(`${project.root}${path.sep}`))) return null;
    return full;
  }
}
