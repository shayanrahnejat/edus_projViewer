async function jsonRequest(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.error || `Request failed (${response.status})`), { data });
  return data;
}

export const api = {
  listProjects: () => jsonRequest('/api/projects'),
  rescan: () => jsonRequest('/api/rescan', { method: 'POST' }),
  project: (id) => jsonRequest(`/api/projects/${id}`),
  compile: (id) => jsonRequest(`/api/projects/${id}/compile`, { method: 'POST' }),
  file: async (id, filePath) => {
    const response = await fetch(`/api/projects/${id}/file?path=${encodeURIComponent(filePath)}`);
    if (!response.ok) throw new Error('Could not read file.');
    return response.text();
  },
  importArchive: async (file) => jsonRequest('/api/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream', 'X-File-Name': encodeURIComponent(file.name) },
    body: file,
  }),
  importFolder: async (fileList) => {
    const files = [...fileList];
    if (!files.length) throw new Error('No folder files selected.');
    const firstPath = files[0].webkitRelativePath || files[0].name;
    const folderName = firstPath.split('/')[0] || 'cde-project';
    const payload = [];
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      const chunk = 0x8000;
      for (let index = 0; index < bytes.length; index += chunk) binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
      payload.push({
        path: (file.webkitRelativePath || file.name).split('/').slice(1).join('/') || file.name,
        base64: btoa(binary),
      });
    }
    return jsonRequest('/api/import-folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderName, files: payload }),
    });
  },
};
