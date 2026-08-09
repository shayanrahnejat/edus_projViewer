const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

export function makeExportRecovery(exportMap = new Map(), extraNames = []) {
  const assignments = [];
  const seen = new Set();

  for (const [exportedName, localName] of exportMap) {
    if (!IDENTIFIER.test(exportedName) || !IDENTIFIER.test(localName)) continue;
    const key = `${exportedName}:${localName}`;
    if (seen.has(key)) continue;
    seen.add(key);
    assignments.push(`try { if (typeof ${localName} !== 'undefined') window[${JSON.stringify(exportedName)}] = ${localName}; } catch (_) {}`);
  }

  for (const name of extraNames) {
    if (!IDENTIFIER.test(name) || seen.has(`${name}:${name}`)) continue;
    seen.add(`${name}:${name}`);
    assignments.push(`try { if (typeof ${name} !== 'undefined') window[${JSON.stringify(name)}] = ${name}; } catch (_) {}`);
  }

  return assignments.join('\n');
}
