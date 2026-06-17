/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  buildVisualizationHtml,
  VisualizeRegionsTool,
} from './codelogician-visualize.js';
import { VISUALIZE_REGIONS_TOOL_NAME } from './tool-names.js';

const REGIONS = [
  {
    label: '"pos"',
    invariant: '"pos"',
    constraints: ['not (x = 0)', 'x >= 1'],
    exampleInput: { x: '1' },
    exampleOutput: '"pos"',
    depth: 1,
    weight: 1,
  },
  {
    label: '"zero"',
    invariant: '"zero"',
    constraints: ['x = 0'],
    exampleInput: { x: '0' },
    exampleOutput: '"zero"',
    depth: 1,
    weight: 1,
  },
];

describe('buildVisualizationHtml', () => {
  const html = buildVisualizationHtml('classify', REGIONS);

  it('produces a self-contained HTML document', () => {
    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).toContain('<svg id="chart">');
  });

  it('loads d3 and d3-delaunay', () => {
    expect(html).toContain('d3@7');
    expect(html).toContain('d3-delaunay@6');
  });

  it('embeds the region data and the function name', () => {
    expect(html).toContain('classify');
    expect(html).toContain('zero'); // invariant text (JSON-escaped in the data)
    expect(html).toContain('not (x = 0)');
    // The embedded data array should be present for the client script.
    expect(html).toContain('const REGIONS = [');
  });

  it('does not leave unresolved placeholders', () => {
    expect(html).not.toContain('__DATA__');
    expect(html).not.toContain('__TITLE__');
  });
});

describe('VisualizeRegionsTool', () => {
  it('exposes the expected name and schema', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tool = new VisualizeRegionsTool({} as any, {} as any);
    expect(tool.name).toBe(VISUALIZE_REGIONS_TOOL_NAME);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema = tool.parameterSchema as any;
    expect(schema.required).toEqual(['file']);
  });
});
