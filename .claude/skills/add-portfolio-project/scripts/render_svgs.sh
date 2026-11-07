#!/usr/bin/env bash
# Render every SVG in a folder to PNG with Playwright's headless Chrome, so the artwork
# can be looked at (Read the PNGs) before handing it back.
#
# Usage: render_svgs.sh SVG_FOLDER OUT_FOLDER
set -euo pipefail

[ $# -eq 2 ] || { echo "usage: $0 SVG_FOLDER OUT_FOLDER" >&2; exit 2; }
src=$(cd "$1" && pwd)
mkdir -p "$2"
out=$(cd "$2" && pwd)

chrome=$(find ~/.cache/ms-playwright -name chrome-headless-shell -type f -perm -u+x 2>/dev/null | head -1)
[ -n "$chrome" ] || { echo "no Playwright chrome-headless-shell under ~/.cache/ms-playwright" >&2; exit 1; }

for svg in "$src"/*.svg; do
    name=$(basename "$svg" .svg)
    # Size the window to the viewBox so the PNG has no margins.
    read -r w h < <(grep -o 'viewBox="[^"]*"' "$svg" | head -1 | tr -d '"' | awk '{print $3, $4}')
    "$chrome" --headless --disable-gpu --hide-scrollbars --window-size="${w:-800},${h:-500}" \
        --screenshot="$out/$name.png" "file://$svg" >/dev/null 2>&1
    echo "$out/$name.png"
done
