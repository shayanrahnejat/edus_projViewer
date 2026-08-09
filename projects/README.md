# Put CDE projects in this folder

The viewer scans this directory whenever it starts and whenever you click **Rescan**.

Supported layouts:

## 1. Direct CDE project

```text
projects/my-project/
├── App/
├── Component/
├── Core/
├── Page/
└── imports.js          # optional
```

Plural `Components/` / `Pages/` are also accepted.

## 2. Repository containing frontend-components

```text
projects/my-repository/
└── frontend-components/
    ├── project-a/
    │   ├── App/
    │   ├── Component/
    │   ├── Core/
    │   └── Page/
    └── project-b/
        └── ...
```

Every detected component becomes a separate previewable project.

## 3. CDE JSON export

A `.json` file can be placed in `projects/` when it contains file objects anywhere in its response tree:

```json
{
  "Result": {
    "files": [
      { "name": "App/index.js", "code": "..." },
      { "name": "Page/Home.js", "code": "..." }
    ]
  }
}
```

The parser searches nested arrays/objects for `{name, code}` records.

## 4. ZIP import

ZIP files are imported from the UI. They are safely extracted into `projects/_imports/` and scanned like normal folders.

## Optional `cde.project.json`

Place it at a project root to configure preview-only browser libraries:

```json
{
  "entryCandidates": ["App"],
  "runtime": {
    "tailwind": true,
    "scripts": ["https://example.com/some-umd-library.js"],
    "styles": ["https://example.com/library.css"],
    "modules": {
      "some-package": "SomeGlobal"
    }
  }
}
```

Relative assets are served from the project root during preview.
