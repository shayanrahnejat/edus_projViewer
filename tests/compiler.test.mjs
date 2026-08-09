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

test('defers top-level CDE boot execution until flattened declarations are initialized', () => {
  const compiled = compileCdeFrontend({
    projectName: 'deferred-cde-boot',
    files: [
      {
        name: 'Core/a-runtime.js',
        code: "export function StartRuntime(){ if(CDE_LATE_VALUE !== 30) throw new Error('late declaration was not initialized'); } StartRuntime();",
      },
      {
        name: 'Core/z-values.js',
        code: 'export const CDE_LATE_VALUE = 30;',
      },
      {
        name: 'App/index.jsx',
        code: 'export function App(){ return <main>Ready</main>; }',
      },
    ],
  });

  const valueIndex = compiled.code.indexOf('CDE_LATE_VALUE = 30');
  const bootIndex = compiled.code.lastIndexOf('StartRuntime();');

  assert.ok(valueIndex >= 0);
  assert.ok(bootIndex > valueIndex);
});

test('normalizes top-level lexical aliases for the shared CDE global scope', () => {
  const compiled = compileCdeFrontend({
    projectName: 'shared-global-aliases',
    files: [
      {
        name: 'Core/a.js',
        code: 'const sharedHook = 1; export function ReadA(){ return sharedHook; }',
      },
      {
        name: 'Page/b.js',
        code: 'const sharedHook = 2; export function ReadB(){ return sharedHook; }',
      },
      {
        name: 'App/index.jsx',
        code: 'export function App(){ return <main>{ReadA() + ReadB()}</main>; }',
      },
    ],
  });

  assert.match(compiled.code, /var sharedHook/);
  assert.match(compiled.code, /window\["App"\]/);
});

test('publishes CDE fixture seeds before dependent stores initialize and delays store boot', () => {
  const compiled = compileCdeFrontend({
    projectName: 'published-mobile-seed',
    files: [
      {
        name: 'Core/store/initialState.js',
        code: `
          export const CDE_MOCK_SEED = Object.freeze({
            users: {
              mock1: { id: 'mock1' },
              mock2: { id: 'mock2' }
            }
          });
          if (typeof globalThis !== 'undefined') {
            globalThis.__CDE_MOCK_SEED__ = CDE_MOCK_SEED;
          }
        `,
      },
      {
        name: 'Core/store/store.js',
        code: `
          export const CDE_STORE_SEED =
            globalThis.__CDE_MOCK_SEED__ || { users: {} };
          export const CDE_STORE_STATE = {
            users: { ...CDE_STORE_SEED.users }
          };
          export function CDEInitStore() {
            globalThis.__CDE_STORE_BOOT_COUNT__ =
              Object.keys(CDE_STORE_STATE.users).length;
          }
          CDEInitStore();
        `,
      },
      {
        name: 'App/index.js',
        code: `
          export function App() {
            return Object.keys(CDE_STORE_STATE.users).length;
          }
        `,
      },
    ],
  });

  const seedInitializationIndex = compiled.code.indexOf('CDE_MOCK_SEED =');
  const seedPublicationIndex = compiled.code.indexOf('globalThis.__CDE_MOCK_SEED__ = CDE_MOCK_SEED');
  const storeInitializationIndex = compiled.code.indexOf('CDE_STORE_SEED = globalThis.__CDE_MOCK_SEED__');
  const storeBootIndex = compiled.code.lastIndexOf('CDEInitStore();');

  assert.ok(seedInitializationIndex >= 0);
  assert.ok(seedPublicationIndex > seedInitializationIndex);
  assert.ok(storeInitializationIndex > seedPublicationIndex);
  assert.ok(storeBootIndex > storeInitializationIndex);
});
