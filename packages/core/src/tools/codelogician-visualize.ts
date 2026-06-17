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
import { VISUALIZE_REGIONS_TOOL_NAME } from './tool-names.js';
import type { MessageBus } from '../confirmation-bus/message-bus.js';
import type { Config } from '../config/config.js';
import { ToolErrorType } from './tool-error.js';
import { isBinaryAvailable } from '../utils/binaryCheck.js';
import { isRecord } from '../utils/markdownUtils.js';
import { CODELOGICIAN_LITE_BINARY, runCodelogician } from './codelogician.js';
import {
  openBrowserSecurely,
  shouldLaunchBrowser,
} from '../utils/secure-browser-launcher.js';
import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/** Parameters for {@link VisualizeRegionsTool}. */
export interface VisualizeRegionsParams {
  /** Path to the IML file with `[@@decomp ...]` request(s), relative to the workspace. */
  file: string;
  /** Name of the decomposed function to visualize (optional; defaults to the first). */
  function?: string;
  /** Zero-based index of the decomposition request to visualize (optional). */
  index?: number;
}

/** A single behavioral region, normalized for rendering. */
interface RegionCell {
  label: string;
  invariant: string;
  constraints: string[];
  exampleInput: Record<string, unknown> | null;
  exampleOutput: unknown;
  depth: number;
  weight: number;
}

const VISUALIZE_PARAMETER_SCHEMA = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      description:
        'Path to the IML (`.iml`) file containing `[@@decomp top ()]` request(s), relative to the workspace root.',
    },
    function: {
      type: 'string',
      description:
        'Name of the decomposed function to visualize. Defaults to the first decomposition in the file.',
    },
    index: {
      type: 'integer',
      description:
        'Zero-based index of the decomposition request to visualize. Defaults to 0.',
    },
  },
  required: ['file'],
} as const;

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' ? value : fallback;
}

/** Flattens a region_groups tree into its leaf regions. */
function flattenRegions(groups: unknown): RegionCell[] {
  const out: RegionCell[] = [];
  const visit = (node: unknown) => {
    const g = asRecord(node);
    if (!g) return;
    const children = g['children'];
    if (Array.isArray(children) && children.length > 0) {
      for (const c of children) visit(c);
      return;
    }
    const invariantRaw = g['invariant'];
    const invariant =
      typeof invariantRaw === 'string'
        ? invariantRaw
        : String(invariantRaw ?? '');
    const constraints = Array.isArray(g['constraints'])
      ? (g['constraints'] as unknown[]).map((c) => String(c))
      : [];
    out.push({
      label: invariant.length > 28 ? `${invariant.slice(0, 27)}…` : invariant,
      invariant,
      constraints,
      exampleInput: asRecord(g['example_input']) ?? null,
      exampleOutput: g['example_output'] ?? null,
      depth: asNumber(g['depth'], 0),
      weight: asNumber(g['weight'], 1),
    });
  };
  if (Array.isArray(groups)) {
    for (const g of groups) visit(g);
  }
  return out;
}

/**
 * Builds a self-contained HTML page that renders the regions as a Voronoi
 * diagram (one cell per region) using D3 + d3-delaunay from a CDN.
 * Exported for unit testing.
 */
export function buildVisualizationHtml(
  functionName: string,
  regions: RegionCell[],
): string {
  const data = JSON.stringify(regions);
  const title = `Region decomposition — ${functionName}`;
  // NOTE: the embedded client script intentionally avoids template literals and
  // `$`+`{` so it can live inside this TS template literal untouched. Only
  // __DATA__ and __TITLE__ are interpolated.
  const client = String.raw`
    const REGIONS = __DATA__;
    const W = 900, H = 640, PAD = 6;
    const svg = d3.select("#chart").attr("viewBox", "0 0 " + W + " " + H);
    const n = REGIONS.length;

    // Seed one point per region with an even phyllotaxis spread, then relax.
    const PHI = Math.PI * (3 - Math.sqrt(5));
    let pts = [];
    for (let i = 0; i < n; i++) {
      const r = Math.sqrt((i + 0.5) / n);
      const a = i * PHI;
      pts.push([
        (0.5 + 0.48 * r * Math.cos(a)) * (W - 2 * PAD) + PAD,
        (0.5 + 0.48 * r * Math.sin(a)) * (H - 2 * PAD) + PAD,
      ]);
    }
    const bounds = [PAD, PAD, W - PAD, H - PAD];
    function relax() {
      const v = d3.Delaunay.from(pts).voronoi(bounds);
      const next = [];
      for (let i = 0; i < n; i++) {
        const poly = v.cellPolygon(i);
        if (!poly) { next.push(pts[i]); continue; }
        let x = 0, y = 0, A = 0;
        for (let j = 0; j < poly.length - 1; j++) {
          const cross = poly[j][0] * poly[j + 1][1] - poly[j + 1][0] * poly[j][1];
          A += cross; x += (poly[j][0] + poly[j + 1][0]) * cross;
          y += (poly[j][1] + poly[j + 1][1]) * cross;
        }
        A *= 0.5;
        if (Math.abs(A) < 1e-6) next.push(pts[i]);
        else next.push([x / (6 * A), y / (6 * A)]);
      }
      pts = next;
    }
    for (let k = 0; k < 3; k++) relax();
    const voronoi = d3.Delaunay.from(pts).voronoi(bounds);

    const color = function (i) { return d3.interpolateTurbo((i + 0.5) / n); };
    const g = svg.append("g");

    function show(i) {
      const reg = REGIONS[i];
      let html = "<h2>Region " + (i + 1) + " of " + n + "</h2>";
      html += "<div class=inv><b>output</b><pre>" + esc(reg.invariant) + "</pre></div>";
      html += "<div><b>constraints</b><ul>";
      for (const c of reg.constraints) html += "<li>" + esc(c) + "</li>";
      if (reg.constraints.length === 0) html += "<li><i>(none)</i></li>";
      html += "</ul></div>";
      if (reg.exampleInput) {
        html += "<div><b>example input</b><pre>" + esc(JSON.stringify(reg.exampleInput, null, 2)) + "</pre></div>";
      }
      if (reg.exampleOutput !== null && reg.exampleOutput !== undefined) {
        html += "<div><b>example output</b><pre>" + esc(String(reg.exampleOutput)) + "</pre></div>";
      }
      document.getElementById("detail").innerHTML = html;
    }
    function esc(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    for (let i = 0; i < n; i++) {
      const poly = voronoi.cellPolygon(i);
      if (!poly) continue;
      g.append("path")
        .attr("d", "M" + poly.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join("L") + "Z")
        .attr("fill", color(i))
        .attr("fill-opacity", 0.82)
        .attr("stroke", "#0b0f14")
        .attr("stroke-width", 1.5)
        .style("cursor", "pointer")
        .on("mouseenter", function () { d3.select(this).attr("fill-opacity", 1); show(i); })
        .on("mouseleave", function () { d3.select(this).attr("fill-opacity", 0.82); })
        .append("title").text(REGIONS[i].invariant);

      const c = d3.polygonCentroid(poly);
      g.append("text")
        .attr("x", c[0]).attr("y", c[1])
        .attr("text-anchor", "middle").attr("dy", "0.35em")
        .attr("pointer-events", "none")
        .attr("fill", "#0b0f14")
        .style("font", "600 12px ui-monospace, Menlo, monospace")
        .text(REGIONS[i].label);
    }
    if (n > 0) show(0);
  `
    .replace('__DATA__', data)
    .replace('__TITLE__', JSON.stringify(title));

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title.replace(/</g, '&lt;')}</title>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-delaunay@6"></script>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; background: #0b0f14; color: #e6edf3;
         font: 14px/1.5 ui-sans-serif, system-ui, sans-serif; display: flex; height: 100vh; }
  #main { flex: 1; min-width: 0; display: flex; flex-direction: column; padding: 16px; }
  h1 { font-size: 16px; margin: 0 0 4px; color: #5eead4; }
  .sub { color: #8b949e; margin: 0 0 12px; font-size: 12px; }
  #chart { width: 100%; flex: 1; min-height: 0; }
  #detail { width: 340px; overflow: auto; padding: 16px; background: #11161d;
            border-left: 1px solid #222; }
  #detail h2 { font-size: 13px; color: #5eead4; margin: 0 0 10px; }
  #detail b { color: #8b949e; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
  #detail ul { margin: 4px 0 12px; padding-left: 18px; }
  #detail li { font-family: ui-monospace, Menlo, monospace; font-size: 12px; }
  #detail pre { margin: 4px 0 12px; padding: 8px; background: #0b0f14; border-radius: 6px;
                font-size: 12px; white-space: pre-wrap; word-break: break-word; }
</style>
</head>
<body>
  <div id="main">
    <h1>${title.replace(/</g, '&lt;')}</h1>
    <p class="sub">${regions.length} disjoint behavioral region(s) — hover a cell for its constraints, output, and example input.</p>
    <svg id="chart"></svg>
  </div>
  <div id="detail"></div>
  <script>${client}</script>
</body>
</html>`;
}

class VisualizeRegionsInvocation extends BaseToolInvocation<
  VisualizeRegionsParams,
  ToolResult
> {
  constructor(
    private readonly config: Config,
    params: VisualizeRegionsParams,
    messageBus: MessageBus,
    toolName?: string,
    toolDisplayName?: string,
  ) {
    super(params, messageBus, toolName, toolDisplayName);
  }

  getDescription(): string {
    return `Visualizing region decomposition of ${this.params.file}`;
  }

  // Always ask before popping open a browser window. With no auto-allow policy
  // for this tool, the default `ask_user` decision routes here, so the user is
  // prompted each time region decomposition wants to show its diagram.
  protected override async getConfirmationDetails(
    _abortSignal: AbortSignal,
  ): Promise<ToolCallConfirmationDetails | false> {
    if (!this.messageBus) {
      return false;
    }
    const target = this.params.function
      ? `\`${this.params.function}\``
      : `\`${this.params.file}\``;
    return {
      type: 'info',
      title: 'View region decomposition?',
      prompt: `Open an interactive Voronoi diagram of the regions of ${target} in your browser?`,
      onConfirm: async () => {
        // Policy updates handled centrally by the scheduler.
      },
    };
  }

  async execute({ abortSignal }: ExecuteOptions): Promise<ToolResult> {
    if (!isBinaryAvailable(CODELOGICIAN_LITE_BINARY)) {
      const msg = `'${CODELOGICIAN_LITE_BINARY}' was not found on PATH.`;
      return {
        llmContent: msg,
        returnDisplay: msg,
        error: { message: msg, type: ToolErrorType.EXECUTION_FAILED },
      };
    }

    const cwd = this.config.getTargetDir();
    const resolvedFile = path.resolve(cwd, this.params.file);
    const args = ['check-decomp', resolvedFile, '--json'];
    if (typeof this.params.index === 'number') {
      args.push('--index', String(this.params.index));
    } else {
      args.push('--check-all');
    }

    let parsed: unknown;
    try {
      const result = await runCodelogician(args, cwd, abortSignal);
      parsed = JSON.parse(result.stdout);
    } catch (error) {
      const m = error instanceof Error ? error.message : String(error);
      return {
        llmContent: `Failed to compute decomposition: ${m}`,
        returnDisplay: `Visualization failed: ${m}`,
        error: { message: m, type: ToolErrorType.EXECUTION_FAILED },
      };
    }

    const obj = asRecord(parsed);
    const rawList = obj?.['decomp_res_list'];
    const list: unknown[] = Array.isArray(rawList) ? rawList : [];
    if (list.length === 0) {
      const msg =
        'No decomposition results found. Ensure the IML file has a `[@@decomp top ()]` request and admits cleanly.';
      return {
        llmContent: msg,
        returnDisplay: msg,
        error: { message: msg, type: ToolErrorType.EXECUTION_FAILED },
      };
    }

    // Pick by function name if given, else the first result.
    let chosen = asRecord(list[0]);
    if (this.params.function) {
      const match = list.find(
        (d) => asRecord(d)?.['function_name'] === this.params.function,
      );
      if (match) chosen = asRecord(match);
    }
    const fnName = String(
      chosen?.['function_name'] ?? this.params.function ?? 'function',
    );
    const decompRes = asRecord(chosen?.['decomp_res']);
    const regions = flattenRegions(decompRes?.['region_groups']);

    if (regions.length === 0) {
      const msg = `Decomposition for '${fnName}' produced no regions to visualize.`;
      return {
        llmContent: msg,
        returnDisplay: msg,
        error: { message: msg, type: ToolErrorType.EXECUTION_FAILED },
      };
    }

    const html = buildVisualizationHtml(fnName, regions);

    // Always write a file the user can open later.
    const outPath = path.join(
      os.tmpdir(),
      `codelogician-regions-${fnName.replace(/[^a-zA-Z0-9_]/g, '_')}.html`,
    );
    await fs.writeFile(outPath, html, 'utf8');

    const summary = `Rendered ${regions.length} region(s) for \`${fnName}\`.`;

    if (!shouldLaunchBrowser()) {
      return {
        llmContent: `${summary} Browser launch is unavailable in this environment; open the file manually: ${outPath}`,
        returnDisplay: `${summary} Saved to ${outPath}`,
      };
    }

    try {
      const url = await this.serveAndOpen(html, abortSignal);
      return {
        llmContent: `${summary} Opened a Voronoi diagram in your browser at ${url} (also saved to ${outPath}).`,
        returnDisplay: `${summary} Opened in browser.`,
      };
    } catch (error) {
      const m = error instanceof Error ? error.message : String(error);
      return {
        llmContent: `${summary} Could not open a browser (${m}); open the file manually: ${outPath}`,
        returnDisplay: `${summary} Saved to ${outPath} (browser launch failed).`,
      };
    }
  }

  /**
   * Serves the HTML from an ephemeral localhost server (so the secure browser
   * launcher's http/https-only policy is satisfied) and opens it. The server is
   * unref'd so it never blocks process exit, and self-closes after 30 minutes.
   */
  private serveAndOpen(html: string, signal: AbortSignal): Promise<string> {
    return new Promise((resolve, reject) => {
      const server = createServer((_req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      });
      server.on('error', reject);
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address();
        if (!addr || typeof addr === 'string') {
          server.close();
          reject(new Error('Failed to bind local server'));
          return;
        }
        const url = `http://127.0.0.1:${addr.port}/`;
        const closeTimer = setTimeout(() => server.close(), 30 * 60 * 1000);
        closeTimer.unref?.();
        signal.addEventListener('abort', () => {
          clearTimeout(closeTimer);
          server.close();
        });
        server.unref();
        openBrowserSecurely(url).then(() => resolve(url), reject);
      });
    });
  }
}

/**
 * Renders an Imandra/CodeLogician region decomposition as an interactive
 * Voronoi diagram in the browser — one cell per disjoint behavioral region,
 * with its constraints, output invariant, and example input.
 */
export class VisualizeRegionsTool extends BaseDeclarativeTool<
  VisualizeRegionsParams,
  ToolResult
> {
  static readonly Name = VISUALIZE_REGIONS_TOOL_NAME;

  constructor(
    private readonly config: Config,
    messageBus: MessageBus,
  ) {
    super(
      VisualizeRegionsTool.Name,
      'VisualizeRegions',
      'Render an Imandra region decomposition as an interactive Voronoi diagram ' +
        'in the browser — one cell per disjoint behavioral region, showing its ' +
        'constraints, output, and example input. Runs `check-decomp` on the given ' +
        'IML file and pops open the visualization.',
      Kind.Execute,
      VISUALIZE_PARAMETER_SCHEMA,
      messageBus,
      /* isOutputMarkdown */ true,
      /* canUpdateOutput */ false,
    );
  }

  protected createInvocation(
    params: VisualizeRegionsParams,
    messageBus: MessageBus,
    toolName?: string,
    toolDisplayName?: string,
  ): ToolInvocation<VisualizeRegionsParams, ToolResult> {
    return new VisualizeRegionsInvocation(
      this.config,
      params,
      messageBus,
      toolName ?? VisualizeRegionsTool.Name,
      toolDisplayName,
    );
  }
}
