import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { ProjectRegistry } from '../server/project-registry.mjs';

test('discovers direct and frontend-components CDE projects plus JSON export', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cde-registry-'));
  await fs.mkdir(path.join(root, 'direct', 'App'), { recursive: true });
  await fs.writeFile(path.join(root, 'direct', 'App', 'index.js'), 'export function App(){}');
  await fs.mkdir(path.join(root, 'repo', 'frontend-components', 'demo', 'App'), { recursive: true });
  await fs.writeFile(path.join(root, 'repo', 'frontend-components', 'demo', 'App', 'index.js'), 'export function App(){}');
  await fs.writeFile(path.join(root, 'export.json'), JSON.stringify({ Result: { files: [{ name: 'App/index.js', code: 'export function App(){}' }] } }));

  const registry = new ProjectRegistry(root);
  const projects = await registry.scan();
  assert.equal(projects.length, 3);
  assert.ok(projects.some((item) => item.name === 'direct'));
  assert.ok(projects.some((item) => item.name === 'demo'));
  assert.ok(projects.some((item) => item.sourceType === 'json'));
});
