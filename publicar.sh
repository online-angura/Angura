#!/usr/bin/env sh
set -eu

git add .

if git diff --cached --quiet; then
  echo "No hay cambios para publicar."
  exit 0
fi

timestamp=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "Actualización $timestamp"
git push origin main