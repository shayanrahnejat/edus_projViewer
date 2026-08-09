import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import ProjectSidebar from './components/ProjectSidebar.jsx';
import PreviewPane from './components/PreviewPane.jsx';
import DiagnosticsPanel from './components/DiagnosticsPanel.jsx';
import FileTree from './components/FileTree.jsx';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [project, setProject] = useState(null);
  const [compiled, setCompiled] = useState(null);
  const [html, setHtml] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [fileView, setFileView] = useState(null);
  const [runtimeEvents, setRuntimeEvents] = useState([]);

  const selectedSummary = useMemo(() => projects.find((item) => item.id === selectedId) || null, [projects, selectedId]);

  const loadProjects = useCallback(async (rescan = false) => {
    setBusy(true);
    try {
      const data = rescan ? await api.rescan() : await api.listProjects();
      setProjects(data.projects || []);
      setSelectedId((current) => current && data.projects.some((item) => item.id === current) ? current : data.projects[0]?.id || null);
      setError(null);
    } catch (requestError) { setError({ message: requestError.message, diagnostic: requestError.data?.diagnostic }); }
    finally { setBusy(false); }
  }, []);

  useEffect(() => { loadProjects(false); }, [loadProjects]);

  const compile = useCallback(async (id) => {
    if (!id) return;
    setBusy(true); setError(null); setCompiled(null); setRuntimeEvents([]);
    try {
      const [projectData, compileData] = await Promise.all([api.project(id), api.compile(id)]);
      setProject(projectData.project);
      setCompiled(compileData.compiled);
      setHtml(compileData.html);
    } catch (requestError) {
      setProject((current) => current?.id === id ? current : null);
      setHtml('');
      setError({ message: requestError.message, diagnostic: requestError.data?.diagnostic });
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { if (selectedId) compile(selectedId); else { setProject(null); setHtml(''); } }, [selectedId, compile]);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.data?.source !== 'edus-cde-preview') return;
      setRuntimeEvents((items) => [...items.slice(-49), event.data]);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const syncViewport = () => {
      frame = 0;
      const viewport = window.visualViewport;
      const width = Math.max(
        1,
        Number(viewport?.width)
          || Number(window.innerWidth)
          || Number(root.clientWidth)
          || 1,
      );
      const height = Math.max(
        1,
        Number(viewport?.height)
          || Number(window.innerHeight)
          || Number(root.clientHeight)
          || 1,
      );

      root.style.setProperty('--edus-viewer-width', `${width}px`);
      root.style.setProperty('--edus-viewer-height', `${height}px`);
      root.style.setProperty('--edus-viewer-vh', `${height * 0.01}px`);
    };

    const scheduleViewportSync = () => {
      if (frame) return;
      frame = requestAnimationFrame(syncViewport);
    };

    const onOrientationChange = () => {
      scheduleViewportSync();
      setTimeout(scheduleViewportSync, 60);
      setTimeout(scheduleViewportSync, 250);
    };

    syncViewport();
    window.addEventListener('resize', scheduleViewportSync, { passive: true });
    window.addEventListener('orientationchange', onOrientationChange, { passive: true });
    window.addEventListener('pageshow', scheduleViewportSync, { passive: true });
    window.visualViewport?.addEventListener('resize', scheduleViewportSync, { passive: true });
    window.visualViewport?.addEventListener('scroll', scheduleViewportSync, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', scheduleViewportSync);
      window.removeEventListener('orientationchange', onOrientationChange);
      window.removeEventListener('pageshow', scheduleViewportSync);
      window.visualViewport?.removeEventListener('resize', scheduleViewportSync);
      window.visualViewport?.removeEventListener('scroll', scheduleViewportSync);
    };
  }, []);

  async function openFile(file) {
    if (!project || file.binary) return;
    try { setFileView({ name: file.name, code: await api.file(project.id, file.name) }); }
    catch (requestError) { setError({ message: requestError.message }); }
  }

  async function importArchive(file) {
    setBusy(true);
    try { const data = await api.importArchive(file); setProjects(data.projects || []); setSelectedId(data.projects?.at(-1)?.id || data.projects?.[0]?.id || null); }
    catch (requestError) { setError({ message: requestError.message, diagnostic: requestError.data?.diagnostic }); }
    finally { setBusy(false); }
  }

  async function importFolder(files) {
    setBusy(true);
    try { const data = await api.importFolder(files); setProjects(data.projects || []); setSelectedId(data.projects?.at(-1)?.id || data.projects?.[0]?.id || null); }
    catch (requestError) { setError({ message: requestError.message, diagnostic: requestError.data?.diagnostic }); }
    finally { setBusy(false); }
  }

  return <div className="app-shell">
    <ProjectSidebar projects={projects} selectedId={selectedId} onSelect={setSelectedId} onRescan={() => loadProjects(true)} onImportArchive={importArchive} onImportFolder={importFolder} busy={busy} />
    <main className="workspace">
      <header className="topbar">
        <div><span className="crumb">CDE</span><span>/</span><strong>{selectedSummary?.name || 'No project'}</strong></div>
        <div className="top-actions"><span className={`status-pill ${error ? 'bad' : busy ? 'busy' : 'good'}`}>{error ? 'Compile error' : busy ? 'Working' : selectedId ? 'Ready' : 'Idle'}</span><button className="ghost-button" disabled={!selectedId || busy} onClick={() => compile(selectedId)}>Compile & reload</button></div>
      </header>

      <div className="workspace-grid">
        <section className="files-panel">
          <div className="panel-toolbar"><div className="toolbar-title"><strong>Files</strong></div><div className="toolbar-meta">{project?.files?.length || 0}</div></div>
          <FileTree files={project?.files || []} onOpen={openFile} />
          <DiagnosticsPanel compiled={compiled} error={error} />
        </section>
        <PreviewPane html={html} projectName={project?.name} compiling={busy} runtimeEvents={runtimeEvents} onClearEvents={() => setRuntimeEvents([])} />
      </div>
    </main>

    {fileView && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setFileView(null); }}>
      <div className="code-modal"><div className="modal-title"><strong>{fileView.name}</strong><button onClick={() => setFileView(null)}>×</button></div><pre>{fileView.code}</pre></div>
    </div>}
  </div>;
}
