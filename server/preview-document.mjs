import { localStoreRuntimeSource } from '../compiler/local-store-runtime.mjs';

function escapeHtml(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

export function buildPreviewDocument({ project, compiled, manifest = {} }) {
  const runtime = manifest.runtime && typeof manifest.runtime === 'object' ? manifest.runtime : {};
  const scripts = Array.isArray(runtime.scripts) ? runtime.scripts.filter((value) => /^https?:\/\//i.test(value)) : [];
  const styles = Array.isArray(runtime.styles) ? runtime.styles.filter((value) => /^https?:\/\//i.test(value)) : [];
  const moduleGlobals = runtime.modules && typeof runtime.modules === 'object' ? runtime.modules : {};
  const tailwind = runtime.tailwind !== false;
  const entryCandidates = Array.from(new Set([
    ...(Array.isArray(manifest.entryCandidates) ? manifest.entryCandidates : []),
    ...(compiled.manifest.entryCandidates || []),
    'App',
  ])).filter(Boolean);

  const assetBase = project.sourceType === 'folder' ? `/api/project-assets/${project.id}/` : '/';
  const externalScripts = scripts.map((src) => `<script src="${escapeHtml(src)}"></script>`).join('\n');
  const externalStyles = styles.map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}">`).join('\n');
  const tailwindScript = tailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : '';

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<base href="${assetBase}" />
${externalStyles}
<style>
html,body,#root{min-height:100%;margin:0}body{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.cde-runtime-error{white-space:pre-wrap;padding:16px;color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;border-radius:12px;margin:16px}
${compiled.css}
</style>
</head>
<body>
<div id="root"></div>
<script src="/runtime/react.js"></script>
<script src="/runtime/react-dom.js"></script>
${tailwindScript}
${externalScripts}
<script>
window.CDEModules = window.CDEModules || {};
for (const [moduleName, globalName] of Object.entries(${safeJson(moduleGlobals)})) {
  if (typeof globalName === 'string' && window[globalName]) window.CDEModules[moduleName] = window[globalName];
}

(function installCdePreviewUrlCompatibility(){
  const NativeURL=window.URL;
  if(typeof NativeURL!=='function') return;

  const normalizePreviewUrlValue=(value)=>{
    if(
      typeof value==='string'
      && (
        value==='about:srcdoc'
        || value==='about:blank'
        || value.startsWith('about:srcdoc#')
        || value.startsWith('about:srcdoc?')
        || value.startsWith('about:blank#')
        || value.startsWith('about:blank?')
      )
    ){
      return document.baseURI;
    }
    return value;
  };

  function CDEPreviewURL(input,base){
    const normalizedInput=normalizePreviewUrlValue(input);
    const normalizedBase=normalizePreviewUrlValue(base);

    if(!new.target){
      return NativeURL(normalizedInput,normalizedBase);
    }

    return new NativeURL(normalizedInput,normalizedBase);
  }

  Object.setPrototypeOf(CDEPreviewURL,NativeURL);
  CDEPreviewURL.prototype=NativeURL.prototype;
  window.URL=CDEPreviewURL;
})();

(function(){
  const send=(type,payload={})=>{ try { window.parent.postMessage({source:'edus-cde-preview',type,...payload},'*'); } catch(_){} };
  window.addEventListener('error',(event)=>send('error',{message:event.message,stack:event.error?.stack||'',filename:event.filename,line:event.lineno,column:event.colno}));
  window.addEventListener('unhandledrejection',(event)=>send('error',{message:String(event.reason?.message||event.reason||'Unhandled promise rejection'),stack:event.reason?.stack||''}));
  const methods=['log','warn','error'];
  for(const method of methods){const original=console[method];console[method]=(...args)=>{send('console',{level:method,args:args.map((arg)=>{try{return typeof arg==='string'?arg:JSON.stringify(arg)}catch(_){return String(arg)}})});original.apply(console,args)}}
})();
</script>
<script>${localStoreRuntimeSource()}</script>
<script>
try {
${compiled.code}
} catch (error) {
  console.error(error);
  const root=document.getElementById('root');
  if(root && !root.hasChildNodes()) root.innerHTML='<pre class="cde-runtime-error"></pre>';
  const pre=document.querySelector('.cde-runtime-error'); if(pre) pre.textContent=error?.stack||String(error);
}
</script>
<script>
(function autoMount(){
  const root=document.getElementById('root');
  if(!root || root.childNodes.length) return;
  const names=${safeJson(entryCandidates)};
  const entry=names.map((name)=>window[name]).find((value)=>typeof value==='function' || (value && typeof value==='object'));
  if(!entry){
    root.innerHTML='<div class="cde-runtime-error">Compiled successfully, but no renderable App export was found. Export App (recommended) or mount the app into #root manually.</div>';
    return;
  }
  try {
    const element=window.React.createElement(entry);
    if(window.ReactDOM.createRoot) window.ReactDOM.createRoot(root).render(element);
    else window.ReactDOM.render(element,root);
  } catch(error){ console.error(error); root.innerHTML='<pre class="cde-runtime-error"></pre>'; root.firstChild.textContent=error?.stack||String(error); }
})();
</script>
</body>
</html>`;
}
