#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Node.js 20+ is required." >&2; exit 1; }
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi
npm run dev
