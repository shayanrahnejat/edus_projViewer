import React from 'react';

export default function DiagnosticsPanel({ compiled, error }) {
  if (error) {
    return <div className="diagnostics-card error-card"><div className="diagnostic-head"><strong>Compile failed</strong><span>{error.diagnostic?.stage || 'compiler'}</span></div><pre>{error.diagnostic?.file ? `${error.diagnostic.file}${error.diagnostic.loc?.line ? `:${error.diagnostic.loc.line}` : ''}\n` : ''}{error.message}</pre></div>;
  }
  if (!compiled) return <div className="diagnostics-card"><div className="diagnostic-head"><strong>Compiler</strong><span>idle</span></div><p>The compiler validates syntax, flattens CDE imports, transforms JSX/TypeScript with Babel, aggregates CSS, recovers exports, and mounts the app.</p></div>;
  const warnings = compiled.diagnostics || [];
  return <div className="diagnostics-card"><div className="diagnostic-head"><strong>Compiler</strong><span>{warnings.length ? `${warnings.length} warning` : 'clean'}</span></div>
    <div className="metric-grid"><div><strong>{compiled.manifest.sourceFiles.length}</strong><span>source</span></div><div><strong>{compiled.manifest.cssFiles.length}</strong><span>styles</span></div><div><strong>{compiled.manifest.documentationFiles.length}</strong><span>docs</span></div></div>
    {warnings.map((warning, index) => <div className="warning-row" key={index}><strong>{warning.file || warning.stage}</strong><span>{warning.message}</span></div>)}
  </div>;
}
