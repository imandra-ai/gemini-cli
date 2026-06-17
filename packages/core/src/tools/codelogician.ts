/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseDeclarativeTool,
  BaseToolInvocation,
  Kind,
  type ToolInvocation,
  type ToolResult,
  type ToolCallConfirmationDetails,
  type ExecuteOptions,
} from './tools.js';
import { CODELOGICIAN_TOOL_NAME } from './tool-names.js';
import type { MessageBus } from '../confirmation-bus/message-bus.js';
import type { Config } from '../config/config.js';
import { ToolErrorType } from './tool-error.js';
import { isBinaryAvailable } from '../utils/binaryCheck.js';
import { isRecord } from '../utils/markdownUtils.js';
import { spawn } from 'node:child_process';
import path from 'node:path';

/**
 * The name of the LLM-friendly CodeLogician CLI used to talk to ImandraX.
 * It is part of the `codelogician` Python package
 * (`uv tool install codelogician` / `pip install codelogician`).
 */
export const CODELOGICIAN_LITE_BINARY = 'codelogician-lite';

/**
 * The operations exposed by `codelogician-lite` that this tool wraps.
 */
export type CodelogicianOperation =
  | 'check'
  | 'list_vg'
  | 'check_vg'
  | 'list_decomp'
  | 'check_decomp'
  | 'gen_test';

/**
 * Parameters for the {@link CodelogicianTool}.
 */
export interface CodelogicianParams {
  /** Which `codelogician-lite` sub-command to run. */
  operation: CodelogicianOperation;
  /** Path to the IML file to analyze (relative to the workspace root). */
  file: string;
  /**
   * Zero-based index(es) of the verification goal / decomposition request to
   * check. Only used by `check_vg` and `check_decomp`. Omit to check all.
   */
  index?: number[];
  /** Check every VG / decomp request (equivalent to omitting `index`). */
  check_all?: boolean;
  /** Include `verify`/`instance` requests when running `check`. */
  with_vgs?: boolean;
  /** Include `[@@decomp ...]` requests when running `check`. */
  with_decomps?: boolean;
  /** Function name to generate tests for. Required for `gen_test`. */
  function?: string;
  /** Target language for `gen_test` (e.g. `python` or `typescript`). */
  lang?: string;
}

const OPERATION_TO_SUBCOMMAND: Record<CodelogicianOperation, string> = {
  check: 'check',
  list_vg: 'list-vg',
  check_vg: 'check-vg',
  list_decomp: 'list-decomp',
  check_decomp: 'check-decomp',
  gen_test: 'gen-test',
};

const CODELOGICIAN_PARAMETER_SCHEMA = {
  type: 'object',
  properties: {
    operation: {
      type: 'string',
      enum: [
        'check',
        'list_vg',
        'check_vg',
        'list_decomp',
        'check_decomp',
        'gen_test',
      ],
      description:
        'The ImandraX operation to perform on an IML file:\n' +
        "- 'check': type-check and admit all structures (run this first; fix any errors before proceeding).\n" +
        "- 'list_vg' / 'check_vg': list / execute verification goals declared with `verify` or `instance`. Returns proved / refuted (with a concrete counterexample) / unknown.\n" +
        "- 'list_decomp' / 'check_decomp': list / execute region-decomposition requests declared with `[@@decomp top ()]`. Returns the disjoint behavioral regions (constraints + invariant + example input/output).\n" +
        "- 'gen_test': generate test cases (python/typescript) from a function's region decomposition.",
    },
    file: {
      type: 'string',
      description:
        'Path to the IML (`.iml`) file to analyze, relative to the workspace root.',
    },
    index: {
      type: 'array',
      items: { type: 'integer' },
      description:
        'Zero-based index(es) of the verification goal or decomposition request to check. Only for check_vg / check_decomp. Omit (or set check_all) to run all.',
    },
    check_all: {
      type: 'boolean',
      description:
        'For check_vg / check_decomp: check every request in the file. Equivalent to omitting `index`.',
    },
    with_vgs: {
      type: 'boolean',
      description:
        'For check: also evaluate `verify`/`instance` requests (default false).',
    },
    with_decomps: {
      type: 'boolean',
      description:
        'For check: also evaluate `[@@decomp ...]` requests (default false).',
    },
    function: {
      type: 'string',
      description:
        'For gen_test: the name of the function to generate tests for.',
    },
    lang: {
      type: 'string',
      description:
        "For gen_test: target language, e.g. 'python' or 'typescript'.",
    },
  },
  required: ['operation', 'file'],
} as const;

export interface ProcessResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

export function runCodelogician(
  args: string[],
  cwd: string,
  signal: AbortSignal,
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(CODELOGICIAN_LITE_BINARY, args, {
      cwd,
      signal,
      env: process.env,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });
    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    child.on('error', (err) => reject(err));
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

/**
 * Builds the `codelogician-lite` argument list for a given set of params.
 * Exported for unit testing.
 */
export function buildCodelogicianArgs(
  params: CodelogicianParams,
  resolvedFile: string,
): string[] {
  const subcommand = OPERATION_TO_SUBCOMMAND[params.operation];

  if (params.operation === 'gen_test') {
    const args = [subcommand, resolvedFile];
    if (params.function) {
      args.push('--function', params.function);
    }
    if (params.lang) {
      args.push('--lang', params.lang);
    }
    return args;
  }

  const args = [subcommand, resolvedFile, '--json'];

  if (params.operation === 'check') {
    if (params.with_vgs) {
      args.push('--with-vgs');
    }
    if (params.with_decomps) {
      args.push('--with-decomps');
    }
  }

  if (params.operation === 'check_vg' || params.operation === 'check_decomp') {
    if (params.check_all) {
      args.push('--check-all');
    } else if (params.index && params.index.length > 0) {
      for (const i of params.index) {
        args.push('--index', String(i));
      }
    } else {
      args.push('--check-all');
    }
  }

  return args;
}

/** Narrowing helper: returns the value as a record, or undefined. */
function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

/**
 * Produces a short, human/LLM-friendly summary of the parsed JSON output.
 * Exported for unit testing.
 */
export function summarizeCodelogicianResult(
  operation: CodelogicianOperation,
  parsed: unknown,
): string {
  const obj = asRecord(parsed);
  if (!obj) {
    return 'CodeLogician returned no structured output.';
  }
  const lines: string[] = [];

  // `check`: eval_res can be an object {success, errors, ...} or the string
  // "Success"; other commands return a string eval_res plus a results list.
  const evalRes = obj['eval_res'];
  if (typeof evalRes === 'string') {
    lines.push(`Eval: ${evalRes}`);
  } else {
    const e = asRecord(evalRes);
    if (e) {
      lines.push(`Eval: ${e['success'] === true ? 'success' : 'failed'}`);
      const errors = e['errors'];
      if (Array.isArray(errors) && errors.length > 0) {
        lines.push(`Eval errors: ${errors.length}`);
      }
    }
  }

  const vgList = obj['vg_res_list'];
  if (operation === 'check_vg' && Array.isArray(vgList)) {
    lines.push(`Verification goals checked: ${vgList.length}`);
    for (const item of vgList) {
      const vg = asRecord(item) ?? {};
      const res = asRecord(vg['vg_res']) ?? {};
      let status = 'unknown';
      if (res['proved'] != null) status = 'PROVED';
      else if (res['refuted'] != null)
        status = 'REFUTED (counterexample found)';
      else if (Array.isArray(res['errors']) && res['errors'].length > 0)
        status = 'ERROR';
      lines.push(
        `  - VG #${vg['vg_req_index']} [${vg['kind'] ?? '?'}]: ${status}`,
      );
    }
  }

  const decompList = obj['decomp_res_list'];
  if (operation === 'check_decomp' && Array.isArray(decompList)) {
    lines.push(`Decomposition requests checked: ${decompList.length}`);
    for (const item of decompList) {
      const d = asRecord(item) ?? {};
      const res = asRecord(d['decomp_res']) ?? {};
      const summary = asRecord(res['summary']) ?? {};
      const nRegions = summary['n_regions'];
      lines.push(
        `  - ${d['function_name'] ?? `#${d['decomp_req_index']}`}: ${
          nRegions ?? '?'
        } region(s)`,
      );
    }
  }

  const diags = obj['diags'] ?? obj['diagnostics'];
  if (Array.isArray(diags) && diags.length > 0) {
    lines.push(`Diagnostics: ${diags.length}`);
  }

  return lines.length > 0 ? lines.join('\n') : 'Done.';
}

class CodelogicianInvocation extends BaseToolInvocation<
  CodelogicianParams,
  ToolResult
> {
  constructor(
    private readonly config: Config,
    params: CodelogicianParams,
    messageBus: MessageBus,
    toolName?: string,
    toolDisplayName?: string,
  ) {
    super(params, messageBus, toolName, toolDisplayName);
  }

  override async shouldConfirmExecute(
    _abortSignal: AbortSignal,
  ): Promise<ToolCallConfirmationDetails | false> {
    // Read-only analysis: it inspects an IML file and queries the ImandraX API,
    // never mutating the workspace.
    return false;
  }

  getDescription(): string {
    const op = OPERATION_TO_SUBCOMMAND[this.params.operation];
    return `Running CodeLogician \`${op}\` on ${this.params.file}`;
  }

  async execute({ abortSignal }: ExecuteOptions): Promise<ToolResult> {
    // Preflight: binary + API key.
    if (!isBinaryAvailable(CODELOGICIAN_LITE_BINARY)) {
      const msg =
        `'${CODELOGICIAN_LITE_BINARY}' was not found on PATH. Install it with ` +
        '`uv tool install codelogician` (or `pip install codelogician`) and ' +
        'get a free Imandra Universe API key at https://universe.imandra.ai.';
      return {
        llmContent: msg,
        returnDisplay: msg,
        error: { message: msg, type: ToolErrorType.EXECUTION_FAILED },
      };
    }
    if (!process.env['IMANDRA_UNI_KEY'] && !process.env['IMANDRAX_API_KEY']) {
      const msg =
        'No Imandra API key found. Set IMANDRA_UNI_KEY (or IMANDRAX_API_KEY) ' +
        'in the environment. Get a free key at https://universe.imandra.ai.';
      return {
        llmContent: msg,
        returnDisplay: msg,
        error: { message: msg, type: ToolErrorType.EXECUTION_FAILED },
      };
    }

    if (this.params.operation === 'gen_test' && !this.params.function) {
      const msg = "gen_test requires the 'function' parameter.";
      return {
        llmContent: msg,
        returnDisplay: msg,
        error: { message: msg, type: ToolErrorType.INVALID_TOOL_PARAMS },
      };
    }

    const cwd = this.config.getTargetDir();
    const resolvedFile = path.resolve(cwd, this.params.file);
    const args = buildCodelogicianArgs(this.params, resolvedFile);

    let result: ProcessResult;
    try {
      result = await runCodelogician(args, cwd, abortSignal);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        llmContent: `Failed to run ${CODELOGICIAN_LITE_BINARY}: ${errorMessage}`,
        returnDisplay: `CodeLogician failed: ${errorMessage}`,
        error: { message: errorMessage, type: ToolErrorType.EXECUTION_FAILED },
      };
    }

    // gen_test emits source code (not JSON) on stdout.
    if (this.params.operation === 'gen_test') {
      if (result.code !== 0 && !result.stdout.trim()) {
        const msg = result.stderr.trim() || `Exited with code ${result.code}`;
        return {
          llmContent: `gen_test failed: ${msg}`,
          returnDisplay: `CodeLogician gen_test failed: ${msg}`,
          error: { message: msg, type: ToolErrorType.EXECUTION_FAILED },
        };
      }
      return {
        llmContent: result.stdout,
        returnDisplay: `Generated tests for \`${this.params.function}\` (${this.params.lang ?? 'unspecified language'}).`,
      };
    }

    // All other operations emit JSON on stdout.
    let parsed: unknown;
    try {
      parsed = JSON.parse(result.stdout);
    } catch {
      // Not JSON: usually a syntax error printed in human form.
      const raw = (result.stdout || result.stderr).trim();
      const msg = raw || `Exited with code ${result.code} and no output.`;
      return {
        llmContent: msg,
        returnDisplay: `CodeLogician ${this.params.operation}: ${msg.split('\n')[0]}`,
        error:
          result.code === 0
            ? undefined
            : { message: msg, type: ToolErrorType.EXECUTION_FAILED },
      };
    }

    const summary = summarizeCodelogicianResult(this.params.operation, parsed);
    const llmContent =
      `${summary}\n\n` +
      `Full ${this.params.operation} result (JSON):\n` +
      '```json\n' +
      `${JSON.stringify(parsed, null, 2)}\n` +
      '```';

    return {
      llmContent,
      returnDisplay: summary,
    };
  }
}

/**
 * A tool that drives Imandra's `codelogician-lite` CLI to reason about IML code
 * with the ImandraX engine: type-checking, property verification (with concrete
 * counterexamples), region decomposition, and test generation.
 */
export class CodelogicianTool extends BaseDeclarativeTool<
  CodelogicianParams,
  ToolResult
> {
  static readonly Name = CODELOGICIAN_TOOL_NAME;

  constructor(
    private readonly config: Config,
    messageBus: MessageBus,
  ) {
    super(
      CodelogicianTool.Name,
      'CodeLogician',
      'Reason about IML (Imandra Modeling Language) code using Imandra/ImandraX. ' +
        'Type-check (`check`), formally verify properties and get concrete ' +
        'counterexamples (`check_vg`), perform region decomposition to enumerate ' +
        'behavioral cases (`check_decomp`), and generate tests from regions ' +
        '(`gen_test`). Operates on `.iml` files via the `codelogician-lite` CLI.',
      Kind.Execute,
      CODELOGICIAN_PARAMETER_SCHEMA,
      messageBus,
      /* isOutputMarkdown */ true,
      /* canUpdateOutput */ false,
    );
  }

  protected createInvocation(
    params: CodelogicianParams,
    messageBus: MessageBus,
    toolName?: string,
    toolDisplayName?: string,
  ): ToolInvocation<CodelogicianParams, ToolResult> {
    return new CodelogicianInvocation(
      this.config,
      params,
      messageBus,
      toolName ?? CodelogicianTool.Name,
      toolDisplayName,
    );
  }
}
