import React, { useEffect, useRef, useState } from 'react';

export default function PreviewPane({ html, projectName, compiling, runtimeEvents, onClearEvents }) {
  const frameRef = useRef(null);
  const panelRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (frameRef.current && html != null) frameRef.current.srcdoc = html;
  }, [html]);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (document.fullscreenElement) {
        setFullscreen(document.fullscreenElement === panelRef.current);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && fullscreen && !document.fullscreenElement) {
        setFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [fullscreen]);

  async function toggleFullscreen() {
    if (fullscreen) {
      setFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch (_) {
        }
      }
      return;
    }

    setFullscreen(true);

    if (panelRef.current?.requestFullscreen) {
      try {
        await panelRef.current.requestFullscreen();
      } catch (_) {
      }
    }
  }

  return <section ref={panelRef} className={`preview-panel${fullscreen ? ' preview-fullscreen' : ''}`}>
    <div className="panel-toolbar preview-toolbar">
      <div className="toolbar-title"><span className="live-dot" /> <strong>{projectName || 'Preview'}</strong></div>
      <div className="preview-toolbar-actions">
        <div className="toolbar-meta">{compiling ? 'Compiling…' : html ? 'Local compiled preview' : 'Choose a project'}</div>
        <button
          type="button"
          className="preview-fullscreen-button"
          onClick={toggleFullscreen}
          disabled={!html}
          aria-label={fullscreen ? 'Exit fullscreen preview' : 'Open fullscreen preview'}
          title={fullscreen ? 'Exit fullscreen' : 'Fullscreen preview'}
        >
          <span aria-hidden="true">{fullscreen ? '×' : '⛶'}</span>
          <span className="preview-fullscreen-label">{fullscreen ? 'Exit' : 'Fullscreen'}</span>
        </button>
      </div>
    </div>
    <div className="preview-stage">
      {html ? <iframe ref={frameRef} title={`${projectName} preview`} sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups" /> : <div className="preview-empty"><div className="preview-empty-mark">CDE</div><h2>Compile a local CDE project</h2><p>Select a project from the left. The viewer runs it through the EDUS-compatible compiler and renders it in this isolated preview.</p></div>}
    </div>
    {runtimeEvents.length > 0 && <div className="runtime-strip">
      <div><strong>Runtime</strong><button onClick={onClearEvents}>clear</button></div>
      {runtimeEvents.slice(-6).map((event, index) => <pre key={index} className={event.type === 'error' ? 'runtime-error' : ''}>{event.type === 'console' ? `[${event.level}] ${(event.args || []).join(' ')}` : event.message}</pre>)}
    </div>}
  </section>;
}
