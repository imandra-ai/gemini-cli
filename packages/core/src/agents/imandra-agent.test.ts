/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { ImandraAgent } from './imandra-agent.js';
import {
  CODELOGICIAN_TOOL_NAME,
  READ_FILE_TOOL_NAME,
  WRITE_FILE_TOOL_NAME,
} from '../tools/tool-names.js';
import { makeFakeConfig } from '../test-utils/config.js';

describe('ImandraAgent', () => {
  const config = makeFakeConfig();

  it('should have the correct agent definition', () => {
    const agent = ImandraAgent(config);
    expect(agent.name).toBe('imandra');
    expect(agent.kind).toBe('local');
    expect(agent.displayName).toBe('Imandra Agent');
    expect(agent.description).toBeDefined();

    const inputSchema =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      agent.inputConfig.inputSchema as any;
    expect(inputSchema.properties['objective']).toBeDefined();
    expect(inputSchema.required).toContain('objective');

    expect(agent.outputConfig?.outputName).toBe('report');
  });

  it('should grant access to the codelogician tool and file tools', () => {
    const agent = ImandraAgent(config);
    expect(agent.toolConfig?.tools).toContain(CODELOGICIAN_TOOL_NAME);
    expect(agent.toolConfig?.tools).toContain(READ_FILE_TOOL_NAME);
    expect(agent.toolConfig?.tools).toContain(WRITE_FILE_TOOL_NAME);
  });

  it('should describe the verify/decompose triggers in its description', () => {
    const agent = ImandraAgent(config);
    expect(agent.description.toLowerCase()).toContain('region decomposition');
    expect(agent.description.toLowerCase()).toContain('verif');
    expect(agent.description.toLowerCase()).toContain('counterexample');
  });

  it('should explain the autoformalization workflow in the system prompt', () => {
    const agent = ImandraAgent(config);
    const prompt = agent.promptConfig.systemPrompt ?? '';
    expect(prompt).toContain('IML');
    expect(prompt).toContain('check_vg');
    expect(prompt).toContain('check_decomp');
  });

  it('should format the output report as pretty JSON', () => {
    const agent = ImandraAgent(config);
    const report = {
      Summary: 's',
      ImlModel: '.imandra/x.iml',
      PropertiesVerified: [],
      Regions: [],
      Recommendations: [],
    };
    expect(agent.processOutput?.(report)).toBe(JSON.stringify(report, null, 2));
  });
});
