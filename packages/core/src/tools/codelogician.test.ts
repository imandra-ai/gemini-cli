/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  buildCodelogicianArgs,
  summarizeCodelogicianResult,
  CodelogicianTool,
  CODELOGICIAN_LITE_BINARY,
  type CodelogicianParams,
} from './codelogician.js';
import { CODELOGICIAN_TOOL_NAME } from './tool-names.js';
import { isBinaryAvailable } from '../utils/binaryCheck.js';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

describe('buildCodelogicianArgs', () => {
  const base = (p: Partial<CodelogicianParams>): CodelogicianParams =>
    ({ operation: 'check', file: 'a.iml', ...p }) as CodelogicianParams;

  it('builds a check command with --json', () => {
    expect(
      buildCodelogicianArgs(base({ operation: 'check' }), '/w/a.iml'),
    ).toEqual(['check', '/w/a.iml', '--json']);
  });

  it('adds --with-vgs and --with-decomps for check', () => {
    expect(
      buildCodelogicianArgs(
        base({ operation: 'check', with_vgs: true, with_decomps: true }),
        '/w/a.iml',
      ),
    ).toEqual(['check', '/w/a.iml', '--json', '--with-vgs', '--with-decomps']);
  });

  it('defaults check_vg to --check-all when no index given', () => {
    expect(
      buildCodelogicianArgs(base({ operation: 'check_vg' }), '/w/a.iml'),
    ).toEqual(['check-vg', '/w/a.iml', '--json', '--check-all']);
  });

  it('passes repeated --index for check_decomp', () => {
    expect(
      buildCodelogicianArgs(
        base({ operation: 'check_decomp', index: [0, 2] }),
        '/w/a.iml',
      ),
    ).toEqual([
      'check-decomp',
      '/w/a.iml',
      '--json',
      '--index',
      '0',
      '--index',
      '2',
    ]);
  });

  it('builds gen_test with function and lang, without --json', () => {
    expect(
      buildCodelogicianArgs(
        base({ operation: 'gen_test', function: 'f', lang: 'python' }),
        '/w/a.iml',
      ),
    ).toEqual(['gen-test', '/w/a.iml', '--function', 'f', '--lang', 'python']);
  });
});

describe('summarizeCodelogicianResult', () => {
  it('summarizes a successful check (object eval_res)', () => {
    const summary = summarizeCodelogicianResult('check', {
      eval_res: { success: true, errors: [] },
    });
    expect(summary).toContain('Eval: success');
  });

  it('summarizes verification goals as proved / refuted', () => {
    const summary = summarizeCodelogicianResult('check_vg', {
      eval_res: 'Success',
      vg_res_list: [
        { vg_req_index: 0, kind: 'verify', vg_res: { proved: {} } },
        { vg_req_index: 1, kind: 'verify', vg_res: { refuted: {} } },
      ],
    });
    expect(summary).toContain('Verification goals checked: 2');
    expect(summary).toContain('PROVED');
    expect(summary).toContain('REFUTED');
  });

  it('summarizes decomposition region counts', () => {
    const summary = summarizeCodelogicianResult('check_decomp', {
      eval_res: 'Success',
      decomp_res_list: [
        {
          decomp_req_index: 0,
          function_name: 'classify',
          decomp_res: { summary: { n_regions: 3 } },
        },
      ],
    });
    expect(summary).toContain('classify');
    expect(summary).toContain('3 region(s)');
  });
});

describe('CodelogicianTool', () => {
  it('exposes the expected name and schema', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tool = new CodelogicianTool({} as any, {} as any);
    expect(tool.name).toBe(CODELOGICIAN_TOOL_NAME);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema = tool.parameterSchema as any;
    expect(schema.required).toEqual(['operation', 'file']);
    expect(schema.properties.operation.enum).toContain('check_decomp');
  });
});

// End-to-end test against the real `codelogician-lite` CLI + ImandraX API.
// Skipped automatically when the binary or an API key is not available (e.g. CI).
const hasCli =
  isBinaryAvailable(CODELOGICIAN_LITE_BINARY) &&
  (!!process.env['IMANDRA_UNI_KEY'] || !!process.env['IMANDRAX_API_KEY']);

describe.skipIf(!hasCli)('CodelogicianTool (live)', () => {
  it('checks a valid IML file end-to-end', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cl-test-'));
    const file = 'ok.iml';
    await fs.writeFile(path.join(dir, file), 'let f x = x + 1\n');

    const tool = new CodelogicianTool(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { getTargetDir: () => dir } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as any,
    );
    const invocation = tool.build({ operation: 'check', file });
    const result = await invocation.execute({
      abortSignal: new AbortController().signal,
    });

    expect(result.error).toBeUndefined();
    expect(String(result.llmContent)).toContain('Eval');
  }, 60_000);
});
