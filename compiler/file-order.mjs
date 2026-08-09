import path from 'node:path';

const FOLDER_PRIORITY = new Map([
  ['core', 10],
  ['component', 20],
  ['components', 20],
  ['page', 30],
  ['pages', 30],
  ['app', 40],
]);

export function normalizeCdePath(input = '') {
  return String(input).replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/+/g, '/');
}

export function cdeFileRank(fileName) {
  const normalized = normalizeCdePath(fileName);
  const parts = normalized.split('/');
  const base = parts.at(-1)?.toLowerCase() || '';
  const top = parts[0]?.toLowerCase() || '';

  if (/^imports\.(js|jsx|mjs|ts|tsx)$/.test(base)) return -1000;

  let folderRank = FOLDER_PRIORITY.get(top) ?? 25;
  let leafRank = 0;

  if (/^imports\./.test(base)) leafRank = -100;
  if (/^index\.(js|jsx|mjs|ts|tsx)$/.test(base)) leafRank = 100;

  return folderRank * 1000 + leafRank;
}

export function sortCdeFiles(files) {
  return [...files].sort((a, b) => {
    const rank = cdeFileRank(a.name) - cdeFileRank(b.name);
    if (rank !== 0) return rank;
    return normalizeCdePath(a.name).localeCompare(normalizeCdePath(b.name), 'en');
  });
}

export function sourceExtension(fileName) {
  return path.extname(normalizeCdePath(fileName)).toLowerCase();
}
