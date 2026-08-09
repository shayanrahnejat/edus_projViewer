import React, { useRef } from 'react';

export default function ProjectSidebar({ projects, selectedId, onSelect, onRescan, onImportArchive, onImportFolder, busy }) {
  const archiveRef = useRef(null);
  const folderRef = useRef(null);
  return <aside className="sidebar">
    <div className="brand-row">
      <div className="brand-mark">E</div>
      <div><strong>EDUS CDE</strong><span>Project Viewer</span></div>
    </div>

    <div className="sidebar-actions">
      <button className="primary-button" disabled={busy} onClick={() => folderRef.current?.click()}>Import folder</button>
      <button className="ghost-button" disabled={busy} onClick={() => archiveRef.current?.click()}>ZIP / JSON</button>
      <button className="icon-button" disabled={busy} title="Rescan projects folder" onClick={onRescan}>↻</button>
      <input ref={archiveRef} type="file" accept=".zip,.json" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) onImportArchive(file); event.target.value = ''; }} />
      <input ref={folderRef} type="file" webkitdirectory="" directory="" multiple hidden onChange={(event) => { if (event.target.files?.length) onImportFolder(event.target.files); event.target.value = ''; }} />
    </div>

    <div className="section-label"><span>Projects</span><span>{projects.length}</span></div>
    <div className="project-list">
      {projects.map((project) => <button key={project.id} className={`project-item ${selectedId === project.id ? 'active' : ''}`} onClick={() => onSelect(project.id)}>
        <span className="project-icon">{project.sourceType === 'json' ? '{}' : '⌘'}</span>
        <span className="project-copy"><strong>{project.name}</strong><small>{project.relativeRoot} · {project.sourceCount} source</small></span>
      </button>)}
      {!projects.length && <div className="empty-sidebar">Put a CDE project in <code>projects/</code>, then rescan.</div>}
    </div>

    <div className="drop-hint"><strong>Permanent drop folder</strong><code>./projects/</code><span>Direct App/Component/Core/Page projects and repositories with frontend-components/ are auto-discovered.</span></div>
  </aside>;
}
