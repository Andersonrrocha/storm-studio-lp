#!/usr/bin/env bash
# Refaz todas as peças a partir da fonte versionada. Uso: social/render-all.sh
set -euo pipefail
cd "$(dirname "$0")/.."
PY=social/.venv/bin/python
[ -x "$PY" ] || { python3 -m venv social/.venv && social/.venv/bin/pip -q install playwright pillow; }
for d in social/carousel/deck-0*.json; do
  n=$(basename "$d" | sed -E 's/deck-([0-9]+)-.*/\1/')
  $PY social/carousel/render.py "$d" "social/out/carrossel-$n"
done
for r in social/reel/*/index.html; do
  ( cd "$(dirname "$r")" && npm run --silent check >/dev/null && npx --yes hyperframes@0.8.31 render --quality high --output "renders/$(basename "$(dirname "$r")").mp4" )
done
echo "saídas: social/out/carrossel-0N/ e social/reel/*/renders/"
