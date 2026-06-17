#!/usr/bin/env bash
#
# Refresh the committed CodeLogician skill docs (.gemini/skills/codelogician)
# from the installed `codelogician` CLI. Run this when you upgrade CodeLogician
# so the shipped IML/ImandraX reference stays in sync with the binary.
#
# Usage: bash scripts/update-codelogician-skill.sh   (or: npm run skill:codelogician)

set -euo pipefail

cd "$(dirname "$0")/.."
DEST=".gemini/skills/codelogician"

if ! command -v codelogician >/dev/null 2>&1; then
  echo "error: 'codelogician' CLI not found on PATH. Install it with 'uv tool install codelogician'." >&2
  exit 1
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Dumping CodeLogician docs..."
codelogician doc dump "$tmp" >/dev/null

# Replace the skill contents with the fresh dump.
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R "$tmp"/. "$DEST"/

# Stamp the CLI version so we know what these docs correspond to.
codelogician --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 \
  > "$DEST/CODELOGICIAN_VERSION"

echo "Updated $DEST (codelogician $(cat "$DEST/CODELOGICIAN_VERSION"))."
echo "Review with: git diff --stat $DEST"
