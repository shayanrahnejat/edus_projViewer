import babel from '@babel/core';
import { parse } from '@babel/parser';
import generateModule from '@babel/generator';
import traverseModule from '@babel/traverse';
import * as t from '@babel/types';
import presetEnv from '@babel/preset-env';
import presetReact from '@babel/preset-react';
import presetTypescript from '@babel/preset-typescript';
import { makeExportRecovery } from './export-recovery.mjs';
import { normalizeCdePath, sortCdeFiles, sourceExtension } from './file-order.mjs';

const generate = generateModule.default || generateModule;
const traverse = traverseModule.default || traverseModule;

const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx']);
const CSS_EXTENSIONS = new Set(['.css']);
const DOC_EXTENSIONS = new Set(['.md', '.mdx', '.txt']);

function parserPlugins(fileName) {
  const ext = sourceExtension(fileName);
  const plugins = [
    'jsx',
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'dynamicImport',
    'importMeta',
    'topLevelAwait',
    'optionalChaining',
    'nullishCoalescingOperator',
  ];
  if (ext === '.ts' || ext === '.tsx') plugins.push('typescript');
  return plugins;
}

function parseFile(file) {
  try {
    return {
      ...file,
      name: normalizeCdePath(file.name),
      ast: parse(file.code, {
        sourceType: 'unambiguous',
        sourceFilename: normalizeCdePath(file.name),
        plugins: parserPlugins(file.name),
        errorRecovery: false,
        allowReturnOutsideFunction: false,
        allowUndeclaredExports: true,
      }),
    };
  } catch (error) {
    const loc = error.loc ? { line: error.loc.line, column: error.loc.column } : null;
    const wrapped = new Error(`${normalizeCdePath(file.name)}${loc ? `:${loc.line}:${loc.column}` : ''} ${error.message}`);
    wrapped.cdeDiagnostic = { file: normalizeCdePath(file.name), loc, message: error.message, stage: 'parse' };
    throw wrapped;
  }
}

function declarationNames(node) {
  const names = [];
  if (t.isFunctionDeclaration(node) || t.isClassDeclaration(node)) {
    if (node.id?.name) names.push(node.id.name);
  } else if (t.isVariableDeclaration(node)) {
    for (const decl of node.declarations) collectPatternNames(decl.id, names);
  }
  return names;
}

function collectPatternNames(pattern, out) {
  if (t.isIdentifier(pattern)) out.push(pattern.name);
  else if (t.isObjectPattern(pattern)) {
    for (const prop of pattern.properties) {
      if (t.isRestElement(prop)) collectPatternNames(prop.argument, out);
      else if (t.isObjectProperty(prop)) collectPatternNames(prop.value, out);
    }
  } else if (t.isArrayPattern(pattern)) {
    for (const item of pattern.elements) if (item) collectPatternNames(item, out);
  } else if (t.isRestElement(pattern)) collectPatternNames(pattern.argument, out);
  else if (t.isAssignmentPattern(pattern)) collectPatternNames(pattern.left, out);
}

function collectModuleExports(parsedFiles) {
  const moduleExports = new Map();
  const defaultNameByFile = new Map();
  let anonymousIndex = 0;

  for (const file of parsedFiles) {
    const exports = new Map();
    for (const node of file.ast.program.body) {
      if (t.isExportNamedDeclaration(node)) {
        if (node.declaration) {
          for (const name of declarationNames(node.declaration)) exports.set(name, name);
        }
        for (const specifier of node.specifiers || []) {
          if (t.isExportSpecifier(specifier)) {
            const exported = t.isIdentifier(specifier.exported) ? specifier.exported.name : specifier.exported.value;
            const local = t.isIdentifier(specifier.local) ? specifier.local.name : specifier.local.value;
            exports.set(exported, local);
          }
        }
      } else if (t.isExportDefaultDeclaration(node)) {
        let localName = null;
        if ((t.isFunctionDeclaration(node.declaration) || t.isClassDeclaration(node.declaration)) && node.declaration.id?.name) {
          localName = node.declaration.id.name;
        } else if (t.isIdentifier(node.declaration)) {
          localName = node.declaration.name;
        } else {
          localName = `__cde_default_${anonymousIndex++}`;
          defaultNameByFile.set(file.name, localName);
        }
        exports.set('default', localName);
      }
    }
    moduleExports.set(file.name, exports);
  }

  return { moduleExports, defaultNameByFile };
}

function resolveRelativeModule(fromName, request, moduleExports) {
  if (!request.startsWith('.')) return null;
  const fromParts = normalizeCdePath(fromName).split('/');
  fromParts.pop();
  const requestParts = request.replaceAll('\\', '/').split('/');
  for (const part of requestParts) {
    if (!part || part === '.') continue;
    if (part === '..') fromParts.pop();
    else fromParts.push(part);
  }
  const base = fromParts.join('/');
  const candidates = [
    base,
    ...['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx'].map((ext) => `${base}${ext}`),
    ...['index.js', 'index.jsx', 'index.mjs', 'index.ts', 'index.tsx'].map((leaf) => `${base}/${leaf}`),
  ];
  return candidates.find((candidate) => moduleExports.has(candidate)) || null;
}

function resolveCdeBoundaryModule(source, moduleExports) {
  if (!source || source.startsWith('.')) return null;

  const normalized = normalizeCdePath(source).replace(/^\/+|\/+$/g, '');
  const parts = normalized.split('/').filter(Boolean);
  const extensions = ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx'];
  const candidates = [];

  for (let index = 0; index < parts.length; index += 1) {
    const suffix = parts.slice(index).join('/');
    for (const ext of extensions) {
      candidates.push(`${suffix}/imports${ext}`);
      candidates.push(`${suffix}/index${ext}`);
      candidates.push(`${suffix}${ext}`);
    }
  }

  return candidates.find((candidate) => moduleExports.has(candidate)) || null;
}

function windowMember(name) {
  return t.memberExpression(t.identifier('window'), t.identifier(name));
}

function optionalModuleMember(moduleName, propertyName = null) {
  const modules = t.memberExpression(t.identifier('window'), t.identifier('CDEModules'));
  const moduleExpr = t.memberExpression(modules, t.stringLiteral(moduleName), true);
  if (!propertyName) return moduleExpr;
  return t.memberExpression(moduleExpr, t.stringLiteral(propertyName), true);
}

function externalImportExpression(source, specifier) {
  const importedName = t.isImportDefaultSpecifier(specifier)
    ? 'default'
    : t.isImportNamespaceSpecifier(specifier)
      ? '*'
      : (t.isIdentifier(specifier.imported) ? specifier.imported.name : specifier.imported.value);

  if (source === 'react') {
    if (importedName === 'default' || importedName === '*') return windowMember('React');
    return t.memberExpression(windowMember('React'), t.identifier(importedName));
  }
  if (source === 'react-dom' || source === 'react-dom/client') {
    if (importedName === 'default' || importedName === '*') return windowMember('ReactDOM');
    return t.memberExpression(windowMember('ReactDOM'), t.identifier(importedName));
  }
  if (/store/i.test(source) && importedName === 'createStore') return windowMember('createStore');

  const moduleExpr = optionalModuleMember(source);
  if (importedName === '*') return moduleExpr;
  if (importedName === 'default') {
    return t.logicalExpression('||', t.memberExpression(moduleExpr, t.identifier('default')), moduleExpr);
  }
  return t.memberExpression(moduleExpr, t.stringLiteral(importedName), true);
}

function relativeImportExpression(targetName, specifier, moduleExports) {
  const exports = moduleExports.get(targetName) || new Map();
  if (t.isImportNamespaceSpecifier(specifier)) {
    const properties = [];
    for (const [exported, local] of exports) {
      if (exported === 'default') continue;
      if (/^[A-Za-z_$][\w$]*$/.test(local)) {
        properties.push(t.objectProperty(t.stringLiteral(exported), t.identifier(local)));
      }
    }
    return t.objectExpression(properties);
  }
  if (t.isImportDefaultSpecifier(specifier)) {
    const local = exports.get('default');
    return local && /^[A-Za-z_$][\w$]*$/.test(local) ? t.identifier(local) : t.identifier(specifier.local.name);
  }
  const imported = t.isIdentifier(specifier.imported) ? specifier.imported.name : specifier.imported.value;
  const local = exports.get(imported) || imported;
  return /^[A-Za-z_$][\w$]*$/.test(local) ? t.identifier(local) : t.identifier(imported);
}

function flattenFile(file, context) {
  const { moduleExports, defaultNameByFile, diagnostics } = context;
  const exportMap = moduleExports.get(file.name) || new Map();

  if (/(^|\/)imports\.(js|jsx|mjs|cjs|ts|tsx)$/i.test(file.name)) {
    traverse(file.ast, {
      VariableDeclaration(path) {
        if (!path.parentPath.isProgram()) return;
        if (path.node.kind === 'var') return;

        const isReactDestructuring = path.node.declarations.length > 0
          && path.node.declarations.every((declaration) => (
            t.isObjectPattern(declaration.id)
            && t.isIdentifier(declaration.init, { name: 'React' })
          ));

        if (isReactDestructuring) {
          path.node.kind = 'var';
        }
      },
    });
  }

  traverse(file.ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      const isStyleImport = /\.(css|scss|sass|less)$/i.test(source);
      if (isStyleImport) {
        path.remove();
        return;
      }

      const relativeTarget = resolveRelativeModule(file.name, source, moduleExports);
      const boundaryTarget = relativeTarget ? null : resolveCdeBoundaryModule(source, moduleExports);
      const internalTarget = relativeTarget || boundaryTarget;
      const isImportsBoundary = /(^|\/)imports\.(js|jsx|mjs|cjs|ts|tsx)$/i.test(file.name);
      const sharedDeclarators = [];

      if (source.startsWith('.') && !relativeTarget) {
        diagnostics.push({
          severity: 'warning',
          stage: 'imports',
          file: file.name,
          message: `Could not resolve relative import ${JSON.stringify(source)}; EDUS flattened-global fallback was used.`,
        });
      }

      for (const specifier of path.node.specifiers) {
        const localName = specifier.local.name;
        const binding = path.scope.getBinding(localName);
        const replacement = internalTarget
          ? relativeImportExpression(internalTarget, specifier, moduleExports)
          : source.startsWith('.')
            ? t.identifier(
                t.isImportSpecifier(specifier)
                  ? (t.isIdentifier(specifier.imported) ? specifier.imported.name : specifier.imported.value)
                  : localName,
              )
            : externalImportExpression(source, specifier);

        if (binding) {
          for (const refPath of binding.referencePaths) {
            if (refPath.parentPath?.isExportSpecifier()) continue;
            refPath.replaceWith(t.cloneNode(replacement, true));
          }
        }

        if (
          isImportsBoundary
          && !(
            internalTarget
            && t.isIdentifier(replacement)
            && replacement.name === localName
          )
        ) {
          sharedDeclarators.push(
            t.variableDeclarator(
              t.identifier(localName),
              t.cloneNode(replacement, true),
            ),
          );
        }
      }

      if (sharedDeclarators.length) {
        path.replaceWith(t.variableDeclaration('var', sharedDeclarators));
      } else {
        path.remove();
      }
    },
  });

  traverse(file.ast, {
    ExportNamedDeclaration(path) {
      if (path.node.declaration) path.replaceWith(path.node.declaration);
      else path.remove();
    },
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration;
      if ((t.isFunctionDeclaration(declaration) || t.isClassDeclaration(declaration)) && declaration.id) {
        path.replaceWith(declaration);
      } else if (t.isIdentifier(declaration)) {
        path.remove();
      } else {
        const name = defaultNameByFile.get(file.name);
        let expression = declaration;
        if (t.isFunctionDeclaration(declaration)) {
          expression = t.functionExpression(null, declaration.params, declaration.body, declaration.generator, declaration.async);
        } else if (t.isClassDeclaration(declaration)) {
          expression = t.classExpression(null, declaration.superClass, declaration.body, declaration.decorators || []);
        }
        path.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(name), expression)]));
      }
    },
  });

  const generated = generate(file.ast, {
    comments: true,
    compact: false,
    retainLines: false,
    sourceMaps: false,
  }, file.code).code;

  return { code: generated, exportMap };
}

function mapMergedLocation(line, ranges) {
  if (!line) return null;
  const range = ranges.find((item) => line >= item.start && line <= item.end);
  if (!range) return null;
  return { file: range.file, line: Math.max(1, line - range.start + 1) };
}

function topLevelCandidateNames(parsedFiles, defaultNameByFile) {
  const names = new Set();
  for (const file of parsedFiles) {
    const lower = file.name.toLowerCase();
    const interesting = /(^|\/)app\/index\.(js|jsx|mjs|ts|tsx)$/.test(lower) || /(^|\/)index\.(js|jsx|mjs|ts|tsx)$/.test(lower);
    if (!interesting) continue;
    const generatedDefault = defaultNameByFile.get(file.name);
    if (generatedDefault) names.add(generatedDefault);
    for (const node of file.ast.program.body) {
      const declaration = t.isExportNamedDeclaration(node) || t.isExportDefaultDeclaration(node) ? node.declaration : node;
      if (declaration) for (const name of declarationNames(declaration)) names.add(name);
    }
  }
  if (names.has('App')) return ['App', ...[...names].filter((name) => name !== 'App')];
  return [...names];
}

export function compileCdeFrontend({ files = [], projectName = 'CDE Project' }) {
  const diagnostics = [];
  const normalized = files
    .filter((file) => file && typeof file.name === 'string' && typeof file.code === 'string')
    .map((file) => ({ name: normalizeCdePath(file.name), code: file.code }));

  const sourceFiles = sortCdeFiles(normalized.filter((file) => SOURCE_EXTENSIONS.has(sourceExtension(file.name))));
  const cssFiles = sortCdeFiles(normalized.filter((file) => CSS_EXTENSIONS.has(sourceExtension(file.name))));
  const docs = normalized.filter((file) => DOC_EXTENSIONS.has(sourceExtension(file.name)));
  const ignored = normalized.filter((file) => !SOURCE_EXTENSIONS.has(sourceExtension(file.name)) && !CSS_EXTENSIONS.has(sourceExtension(file.name)) && !DOC_EXTENSIONS.has(sourceExtension(file.name)));

  if (!sourceFiles.length) {
    const error = new Error('No JavaScript/JSX/TypeScript CDE source files were found.');
    error.cdeDiagnostic = { stage: 'discovery', message: error.message };
    throw error;
  }

  const parsedFiles = sourceFiles.map(parseFile);
  const { moduleExports, defaultNameByFile } = collectModuleExports(parsedFiles);
  const flattened = parsedFiles.map((file) => flattenFile(file, { moduleExports, defaultNameByFile, diagnostics }));

  const ranges = [];
  const mergedParts = [];
  let line = 1;
  for (let index = 0; index < flattened.length; index += 1) {
    const file = parsedFiles[index];
    const code = flattened[index].code;
    const marker = `/* @cde-source ${file.name} */`;
    mergedParts.push(marker, code);
    const codeLines = code.split('\n').length;
    ranges.push({ file: file.name, start: line + 1, end: line + codeLines });
    line += 1 + codeLines;
  }

  const aggregateExports = new Map();
  for (const exports of moduleExports.values()) {
    for (const [exported, local] of exports) {
      if (exported !== 'default') aggregateExports.set(exported, local);
    }
  }

  const candidates = topLevelCandidateNames(parsedFiles, defaultNameByFile);
  const recovery = makeExportRecovery(aggregateExports, ['App', ...candidates]);
  mergedParts.push('/* @cde-export-recovery */', recovery);
  const merged = mergedParts.join('\n');

  let result;
  try {
    result = babel.transformSync(merged, {
      filename: `${projectName.replace(/[^A-Za-z0-9_.-]/g, '_')}.tsx`,
      sourceType: 'script',
      babelrc: false,
      configFile: false,
      comments: true,
      compact: false,
      presets: [
        [presetTypescript, { allExtensions: true, isTSX: true, allowDeclareFields: true }],
        [presetReact, { runtime: 'classic', development: false }],
        [presetEnv, { targets: { chrome: '100' }, modules: false, bugfixes: true }],
      ],
    });
  } catch (error) {
    const mapped = mapMergedLocation(error.loc?.line, ranges);
    const diagnostic = {
      severity: 'error',
      stage: 'transform',
      file: mapped?.file || null,
      loc: mapped ? { line: mapped.line, column: error.loc?.column ?? null } : error.loc || null,
      message: error.message,
    };
    error.cdeDiagnostic = diagnostic;
    throw error;
  }

  return {
    code: result?.code || '',
    css: cssFiles.map((file) => `/* @cde-source ${file.name} */\n${file.code}`).join('\n\n'),
    diagnostics,
    manifest: {
      projectName,
      sourceFiles: sourceFiles.map((file) => file.name),
      cssFiles: cssFiles.map((file) => file.name),
      documentationFiles: docs.map((file) => file.name),
      ignoredFiles: ignored.map((file) => file.name),
      entryCandidates: ['App', ...candidates.filter((name) => name !== 'App')],
    },
  };
}
