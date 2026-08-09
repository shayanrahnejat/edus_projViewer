import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { compileCdeFrontend } from './compiler/frontend-compiler.mjs';
import { ProjectRegistry } from './server/project-registry.mjs';
import { buildPreviewDocument } from './server/preview-document.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const projectsDir = path.join(root, 'projects');
const distDir = path.join(root, 'dist');

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value), 'utf8');
}

function publicProjectPayload(project, manifest) {
  return {
    project: {
      id: project.id,
      name: project.name,
      sourceType: project.sourceType,
      relativeRoot: project.relativeRoot,
      files: project.files.map((file) => ({
        name: file.name,
        binary: Boolean(file.binary),
      })),
      manifest,
    },
    textFiles: Object.fromEntries(
      project.files
        .filter((file) => !file.binary && typeof file.code === 'string')
        .map((file) => [file.name, file.code]),
    ),
  };
}

async function copyPreviewRuntime() {
  const runtimeDir = path.join(distDir, 'runtime');
  await fs.mkdir(runtimeDir, { recursive: true });

  await Promise.all([
    fs.copyFile(
      path.join(root, 'node_modules/react/umd/react.development.js'),
      path.join(runtimeDir, 'react.js'),
    ),
    fs.copyFile(
      path.join(root, 'node_modules/react-dom/umd/react-dom.development.js'),
      path.join(runtimeDir, 'react-dom.js'),
    ),
  ]);
}

function edusStaticProjectCatalog() {
  return {
    name: 'edus-static-project-catalog',
    apply: 'build',

    async writeBundle() {
      const registry = new ProjectRegistry(projectsDir);
      const projects = await registry.scan();

      await writeJson(
        path.join(distDir, 'cde-static/projects.json'),
        { projects },
      );

      await copyPreviewRuntime();

      await writeJson(
        path.join(distDir, 'manifest.webmanifest'),
        {
          id: '/',
          name: 'EDUS CDE Project Viewer',
          short_name: 'EDUS CDE',
          start_url: '/',
          scope: '/',
          display: 'fullscreen',
          display_override: ['fullscreen', 'standalone'],
          orientation: 'any',
          background_color: '#0b0d12',
          theme_color: '#0b0d12',
        },
      );

      for (const summary of projects) {
        const project = await registry.refreshProject(summary.id);
        if (!project) continue;

        const manifest = await registry.manifest(project);

        await writeJson(
          path.join(
            distDir,
            'cde-static/projects',
            `${project.id}.json`,
          ),
          publicProjectPayload(project, manifest),
        );

        if (project.sourceType === 'folder') {
          await fs.cp(
            project.root,
            path.join(distDir, 'cde-assets', project.id),
            { recursive: true },
          );
        }

        try {
          const compiled = compileCdeFrontend({
            files: project.files.filter((file) => !file.binary),
            projectName: project.name,
          });

          const html = buildPreviewDocument({
            project,
            compiled,
            manifest,
            assetBase: project.sourceType === 'folder'
              ? `/cde-assets/${project.id}/`
              : '/',
          });

          await writeJson(
            path.join(
              distDir,
              'cde-static/compiles',
              `${project.id}.json`,
            ),
            { compiled, html },
          );
        } catch (error) {
          await writeJson(
            path.join(
              distDir,
              'cde-static/compiles',
              `${project.id}.json`,
            ),
            {
              error: error.message,
              diagnostic: error.cdeDiagnostic || null,
            },
          );
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    edusStaticProjectCatalog(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
