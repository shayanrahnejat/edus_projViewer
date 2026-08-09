import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { compileCdeFrontend } from '../compiler/frontend-compiler.mjs';
import { ProjectRegistry } from './project-registry.mjs';
import { importFolderPayload, importRawFile } from './archive-import.mjs';
import { buildPreviewDocument } from './preview-document.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const projectsDir = path.join(root, 'projects');
const production = process.argv.includes('--production') || process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 4178);
const app = express();
const registry = new ProjectRegistry(projectsDir);

await registry.scan();

app.use('/api/import-folder', express.json({ limit: '210mb' }));
app.use('/api/import', express.raw({ type: '*/*', limit: '210mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, production, projectsDir }));

app.get('/api/projects', async (_req, res) => {
  try { res.json({ projects: await registry.scan() }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/rescan', async (_req, res) => {
  try { res.json({ projects: await registry.scan() }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/projects/:id', async (req, res) => {
  const project = registry.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });
  const refreshed = await registry.refreshProject(project.id);
  res.json({
    project: {
      id: refreshed.id,
      name: refreshed.name,
      sourceType: refreshed.sourceType,
      relativeRoot: refreshed.relativeRoot,
      files: refreshed.files.map((file) => ({ name: file.name, binary: Boolean(file.binary) })),
      manifest: await registry.manifest(refreshed),
    },
  });
});

app.get('/api/projects/:id/file', async (req, res) => {
  const project = registry.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });
  try {
    const content = await registry.readTextFile(project, String(req.query.path || ''));
    res.type('text/plain').send(content);
  } catch (error) { res.status(404).json({ error: error.message }); }
});

app.post('/api/projects/:id/compile', async (req, res) => {
  const project = registry.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });
  try {
    const refreshed = await registry.refreshProject(project.id);
    const manifest = await registry.manifest(refreshed);
    const compiled = compileCdeFrontend({ files: refreshed.files.filter((file) => !file.binary), projectName: refreshed.name });
    const html = buildPreviewDocument({ project: refreshed, compiled, manifest });
    res.json({ compiled, html });
  } catch (error) {
    res.status(422).json({
      error: error.message,
      diagnostic: error.cdeDiagnostic || null,
      stack: process.env.CDE_VIEWER_DEBUG ? error.stack : undefined,
    });
  }
});

app.post('/api/import', async (req, res) => {
  try {
    const fileName = decodeURIComponent(String(req.header('x-file-name') || 'import.zip'));
    const result = await importRawFile({ projectsDir, fileName, buffer: req.body });
    res.json({ imported: result, projects: await registry.scan() });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.post('/api/import-folder', async (req, res) => {
  try {
    const result = await importFolderPayload({ projectsDir, folderName: req.body?.folderName, files: req.body?.files });
    res.json({ imported: result, projects: await registry.scan() });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.get(/^\/api\/project-assets\/([a-f0-9]+)\/(.*)$/, async (req, res) => {
  const id = req.params[0];
  const relativePath = req.params[1] || '';
  const project = registry.get(id);
  const file = registry.resolveAsset(project, relativePath);
  if (!file) return res.status(404).end();
  try { await fs.access(file); res.sendFile(file); } catch (_) { res.status(404).end(); }
});

const reactUmd = path.join(root, 'node_modules/react/umd/react.development.js');
const reactDomUmd = path.join(root, 'node_modules/react-dom/umd/react-dom.development.js');
app.get('/runtime/react.js', (_req, res) => res.sendFile(reactUmd));
app.get('/runtime/react-dom.js', (_req, res) => res.sendFile(reactDomUmd));

if (!production) {
  const { createServer } = await import('vite');
  const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
} else {
  const dist = path.join(root, 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(port, () => {
  console.log(`EDUS CDE Project Viewer running at http://localhost:${port}`);
  console.log(`Drop CDE projects into: ${projectsDir}`);
});
