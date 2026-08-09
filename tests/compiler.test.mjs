import test from 'node:test';
import assert from 'node:assert/strict';
import { compileCdeFrontend } from '../compiler/frontend-compiler.mjs';
import { sortCdeFiles } from '../compiler/file-order.mjs';

test('orders imports first and App index last', () => {
  const files = sortCdeFiles([
    { name: 'App/index.jsx', code: '' },
    { name: 'Page/Home.jsx', code: '' },
    { name: 'imports.js', code: '' },
    { name: 'Core/store.js', code: '' },
  ]);
  assert.deepEqual(files.map((file) => file.name), ['imports.js', 'Core/store.js', 'Page/Home.jsx', 'App/index.jsx']);
});

test('flattens relative imports, JSX and named exports', () => {
  const compiled = compileCdeFrontend({
    projectName: 'test',
    files: [
      { name: 'Component/Greeting.jsx', code: "export function Greeting({name}) { return <strong>Hello {name}</strong>; }" },
      { name: 'App/index.jsx', code: "import { Greeting as G } from '../Component/Greeting.jsx'; export function App(){ return <G name='EDUS'/>; }" },
      { name: 'App/styles.css', code: '.x{display:block}' },
      { name: 'README.md', code: '# docs' },
    ],
  });
  assert.match(compiled.code, /React\.createElement/);
  assert.match(compiled.code, /window\["App"\]/);
  assert.match(compiled.css, /display:block/);
  assert.deepEqual(compiled.manifest.documentationFiles, ['README.md']);
});

test('reports source file for syntax error', () => {
  assert.throws(() => compileCdeFrontend({ files: [{ name: 'App/index.jsx', code: 'export function App( {' }] }), /App\/index\.jsx/);
});

test('recovers an anonymous default App entry', () => {
  const compiled = compileCdeFrontend({
    projectName: 'anonymous-default',
    files: [{ name: 'App/index.jsx', code: "export default () => <main>Anonymous App</main>;" }],
  });
  assert.match(compiled.code, /__cde_default_/);
  assert.match(compiled.code, /window\[/);
  assert.ok(compiled.manifest.entryCandidates.some((name) => name.startsWith('__cde_default_')));
});
