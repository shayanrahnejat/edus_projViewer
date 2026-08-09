# EDUS CDE Project Viewer

A standalone local application for browsing and previewing CDE frontend projects with an EDUS-compatible compiler pipeline.

## What it does

- scans a permanent `projects/` drop folder;
- discovers direct `App / Component / Core / Page` projects;
- discovers projects nested under `frontend-components/`;
- reads nested CDE JSON exports containing `{name, code}` file records;
- imports ZIP or whole folders from the browser UI;
- compiles JavaScript, JSX, TypeScript and TSX;
- keeps Markdown/text files in the project but excludes them from the JavaScript/CSS compilation aggregate;
- flattens CDE module imports and resolves relative named/default imports against the global CDE source set;
- applies Babel JSX/TypeScript/modern-JS transformations;
- aggregates CSS independently;
- recovers exported globals for CDE-style shared scope;
- provides a small EDUS local-store-compatible runtime;
- previews the result in an isolated iframe;
- serves relative project assets during preview;
- shows compiler diagnostics and runtime console/error events.

## Start

### Windows

Double-click `START-WINDOWS.cmd`.

### Linux / macOS

```bash
./START-LINUX.sh
```

Or run manually:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:4178
```

## Add your project

Copy it into:

```text
projects/
```

For example:

```text
projects/medu-ai/
├── App/
├── Component/
├── Core/
├── Page/
└── imports.js
```

You can also copy an entire repository with `frontend-components/*` beneath it. Click **Rescan** after copying, or restart the viewer.

The included `projects/example-cde/` project proves the compiler/preview flow before you add your own files.

## Import from UI

- **Import folder** copies a browser-selected folder to `projects/_imports/`.
- **ZIP / JSON** safely extracts a ZIP or stores a CDE JSON export in `projects/_imports/`.

Imported files remain there until you delete them.

## Compiler compatibility

This project follows the verified EDUS CDE compiler contract: deterministic ordering, flattened imports, Babel transformation, CSS runtime separation, export recovery, local-store support, syntax validation, `imports.*` precedence, and `index.*`/App ordering. It is intentionally a standalone compatibility implementation rather than a dependency on the EDUS Studio Electron shell.

The compiler source is under:

```text
compiler/
├── frontend-compiler.mjs
├── export-recovery.mjs
├── file-order.mjs
└── local-store-runtime.mjs
```

## Optional runtime libraries

If a CDE project imports a browser library that is not React/ReactDOM or the built-in store shim, define a UMD/global bridge in `cde.project.json`. See `projects/README.md`.

Tailwind browser CDN loading is enabled by default for compatibility with CDE projects that use Tailwind utility classes. Set `runtime.tailwind` to `false` for projects that do not need it.

## Production build

```bash
npm run build
npm start
```

## Tests

```bash
npm test
```

## Security notes

- ZIP and folder imports reject `..` traversal.
- asset and source reads are constrained to the selected project root;
- previews run inside a sandboxed iframe;
- the viewer does not implement CDE remote saves or credentials;
- `cde.project.json` external scripts/styles are preview-only and should only reference libraries you trust.
"# edus_projViewer" 
