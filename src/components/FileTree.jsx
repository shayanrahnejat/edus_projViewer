import React, { useMemo, useState } from 'react';

function buildTree(files) {
  const root = { name: '', type: 'folder', children: new Map() };
  for (const file of files) {
    const parts = file.name.split('/').filter(Boolean);
    let node = root;
    parts.forEach((part, index) => {
      if (!node.children.has(part)) node.children.set(part, { name: part, type: index === parts.length - 1 ? 'file' : 'folder', children: new Map(), file: index === parts.length - 1 ? file : null });
      node = node.children.get(part);
    });
  }
  return root;
}

function TreeNode({ node, depth, onOpen }) {
  const [open, setOpen] = useState(depth < 1);
  if (node.type === 'file') {
    return <button className="tree-file" style={{ paddingInlineStart: 12 + depth * 14 }} onClick={() => onOpen(node.file)}><span>{node.file.binary ? '◈' : '·'}</span><span>{node.name}</span></button>;
  }
  const children = [...node.children.values()].sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1));
  return <div className="tree-folder-wrap">
    {node.name && <button className="tree-folder" style={{ paddingInlineStart: 8 + depth * 14 }} onClick={() => setOpen((value) => !value)}><span>{open ? '⌄' : '›'}</span><span>{node.name}</span></button>}
    {(open || !node.name) && <div>{children.map((child) => <TreeNode key={`${depth}-${child.name}`} node={child} depth={node.name ? depth + 1 : depth} onOpen={onOpen} />)}</div>}
  </div>;
}

export default function FileTree({ files, onOpen }) {
  const tree = useMemo(() => buildTree(files), [files]);
  if (!files?.length) return <div className="muted-block">No files found.</div>;
  return <div className="file-tree"><TreeNode node={tree} depth={0} onOpen={onOpen} /></div>;
}
