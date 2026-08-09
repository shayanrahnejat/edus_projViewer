const staticProjectCache = new Map();

async function responseJson(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) return null;
  return response.json().catch(() => null);
}

async function staticJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  const data = await responseJson(response);

  if (!response.ok || !data) {
    throw Object.assign(
      new Error(`Static project data is unavailable (${response.status}).`),
      { data },
    );
  }

  return data;
}

async function jsonRequest(url, options = {}, fallbackUrl = null) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (networkError) {
    if (fallbackUrl) return staticJson(fallbackUrl);
    throw networkError;
  }

  const data = await responseJson(response);

  if (response.ok && data) return data;

  if (
    fallbackUrl
    && (
      response.status === 404
      || response.status === 405
      || !data
    )
  ) {
    return staticJson(fallbackUrl);
  }

  throw Object.assign(
    new Error(data?.error || `Request failed (${response.status})`),
    { data },
  );
}

async function staticProject(id) {
  if (!staticProjectCache.has(id)) {
    staticProjectCache.set(
      id,
      staticJson(
        `/cde-static/projects/${encodeURIComponent(id)}.json`,
      ),
    );
  }

  return staticProjectCache.get(id);
}

async function compileProject(id) {
  const data = await jsonRequest(
    `/api/projects/${encodeURIComponent(id)}/compile`,
    { method: 'POST' },
    `/cde-static/compiles/${encodeURIComponent(id)}.json`,
  );

  if (data.error) {
    throw Object.assign(
      new Error(data.error),
      { data },
    );
  }

  return data;
}

async function readProjectFile(id, filePath) {
  let response = null;

  try {
    response = await fetch(
      `/api/projects/${encodeURIComponent(id)}/file?path=${encodeURIComponent(filePath)}`,
    );
  } catch (_) {
  }

  const contentType = response?.headers.get('content-type') || '';

  if (
    response?.ok
    && !contentType.toLowerCase().includes('text/html')
  ) {
    return response.text();
  }

  if (
    response
    && !response.ok
    && response.status !== 404
    && response.status !== 405
  ) {
    throw new Error('Could not read file.');
  }

  const payload = await staticProject(id);

  if (
    !Object.prototype.hasOwnProperty.call(
      payload.textFiles || {},
      filePath,
    )
  ) {
    throw new Error('Could not read file.');
  }

  return payload.textFiles[filePath];
}

export const api = {
  listProjects: () => jsonRequest(
    '/api/projects',
    {},
    '/cde-static/projects.json',
  ),

  rescan: () => jsonRequest(
    '/api/rescan',
    { method: 'POST' },
    '/cde-static/projects.json',
  ),

  project: async (id) => {
    const data = await jsonRequest(
      `/api/projects/${encodeURIComponent(id)}`,
      {},
      `/cde-static/projects/${encodeURIComponent(id)}.json`,
    );

    if (data.textFiles) {
      staticProjectCache.set(
        id,
        Promise.resolve(data),
      );
    }

    return { project: data.project };
  },

  compile: compileProject,

  file: readProjectFile,

  importArchive: async (file) => jsonRequest('/api/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-File-Name': encodeURIComponent(file.name),
    },
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

      for (let index = 0; index < bytes.length; index += chunk) {
        binary += String.fromCharCode(
          ...bytes.subarray(index, index + chunk),
        );
      }

      payload.push({
        path: (file.webkitRelativePath || file.name)
          .split('/')
          .slice(1)
          .join('/')
          || file.name,
        base64: btoa(binary),
      });
    }

    return jsonRequest('/api/import-folder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        folderName,
        files: payload,
      }),
    });
  },
};
