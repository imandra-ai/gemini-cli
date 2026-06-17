/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { isBinaryAvailable } from './binaryCheck.js';

const INSTALL_COMMAND =
  'curl -fsSL https://codelogician.dev/codelogician/install.sh | sh';

/** Prepend ~/.local/bin to this process's PATH if present and not already there. */
function ensureLocalBinOnPath(): void {
  const localBin = path.join(os.homedir(), '.local', 'bin');
  const current = process.env['PATH'] ?? '';
  if (
    existsSync(localBin) &&
    !current.split(path.delimiter).includes(localBin)
  ) {
    process.env['PATH'] = `${localBin}${path.delimiter}${current}`;
  }
}

function codelogicianAvailable(): boolean {
  return (
    isBinaryAvailable('codelogician-lite') || isBinaryAvailable('codelogician')
  );
}

/**
 * Ensures the CodeLogician CLI is installed BEFORE tools/agents register, so the
 * `formalreasoning` agent and `codelogician` tool light up in the same session
 * (no restart needed). If the binary is missing, runs the official installer
 * once, then makes the just-installed `~/.local/bin` visible to this process.
 *
 * Never throws — startup must not be blocked by a failed install. Skipped on
 * Windows (the installer is POSIX) and opt-out via CODELOGICIAN_NO_AUTOINSTALL=1.
 */
export function ensureCodelogicianInstalled(): void {
  if (process.platform === 'win32') {
    return;
  }
  ensureLocalBinOnPath();
  if (codelogicianAvailable()) {
    return;
  }
  if (process.env['CODELOGICIAN_NO_AUTOINSTALL'] === '1') {
    return;
  }
  if (!isBinaryAvailable('curl')) {
    return;
  }
  try {
    process.stderr.write(
      '[codelogician] not found — installing from codelogician.dev ...\n',
    );
    execSync(INSTALL_COMMAND, { stdio: ['ignore', 'inherit', 'inherit'] });
  } catch {
    process.stderr.write(
      `[codelogician] auto-install failed; continuing without it. Install manually: ${INSTALL_COMMAND}\n`,
    );
  }
  ensureLocalBinOnPath();
}
