#!/usr/bin/env bash
#
# SessionStart hook: make sure the CodeLogician CLI is installed.
#
# If `codelogician` / `codelogician-lite` is not found, this runs the official
# installer so the formalreasoning agent and codelogician tool work. It only
# installs when the binary is MISSING (so it's a one-time action, not every
# start), and it never blocks startup.
#
# Security note: this auto-executes a remote install script
# (`curl -fsSL https://codelogician.dev/codelogician/install.sh | sh`).
# Set CODELOGICIAN_NO_AUTOINSTALL=1 to disable the auto-install.
#
# Contract: print exactly ONE JSON object on stdout; ALL installer output goes
# to stderr (per the hooks "golden rule").

set -uo pipefail

emit() { printf '%s' "$1"; exit 0; }

# Drain the SessionStart payload ({source: startup|resume|clear}); we don't need it.
cat >/dev/null 2>&1 || true

have_cl() {
  command -v codelogician-lite >/dev/null 2>&1 ||
    command -v codelogician >/dev/null 2>&1 ||
    [ -x "$HOME/.local/bin/codelogician-lite" ] ||
    [ -x "$HOME/.local/bin/codelogician" ]
}

# Fast path: already installed.
have_cl && emit '{}'

if [ "${CODELOGICIAN_NO_AUTOINSTALL:-}" = "1" ]; then
  emit '{"systemMessage":"CodeLogician not found; auto-install disabled (CODELOGICIAN_NO_AUTOINSTALL=1). Install: curl -fsSL https://codelogician.dev/codelogician/install.sh | sh"}'
fi

if ! command -v curl >/dev/null 2>&1; then
  emit '{"systemMessage":"CodeLogician not found and curl is unavailable. Install manually: https://codelogician.dev"}'
fi

# Install. Send all installer output to stderr so stdout stays JSON-only.
{
  echo "[codelogician] not found on PATH — installing from codelogician.dev ..."
  curl -fsSL https://codelogician.dev/codelogician/install.sh | sh
} >&2 || true

if have_cl; then
  emit '{"systemMessage":"Installed CodeLogician. Restart the CLI to enable the formalreasoning agent and the codelogician tool."}'
fi

emit '{"systemMessage":"CodeLogician auto-install did not complete; the formalreasoning agent is unavailable. Try: curl -fsSL https://codelogician.dev/codelogician/install.sh | sh"}'
