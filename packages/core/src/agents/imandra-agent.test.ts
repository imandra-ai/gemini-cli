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
    expect(agent.name).toBe('formalreasoning');
    expect(agent.kind).toBe('local');
    expect(agent.displayName).toBe('Formal Reasoning Agent');
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

  it('renders the report plain-first, with formal detail in a labeled appendix', () => {
    const agent = ImandraAgent(config);
    const report = {
      PlainSummary: 'Checked the deposit/withdrawal logic for the account.',
      Findings: [
        {
          Issue: 'A negative amount slips past the balance check',
          Severity: 'bug' as const,
          Trigger: 'amount = -50',
          Recommendation: 'Reject amounts below zero',
        },
      ],
      TechnicalDetails: {
        ImlModel: '.imandra/account.iml',
        Verified: [
          {
            Property: 'balance never negative',
            Result: 'refuted' as const,
            Counterexample: 'amount=-50',
          },
        ],
        Regions: [],
      },
    };
    const out = agent.processOutput?.(report) ?? '';
    // Plain summary + finding come first, in domain terms.
    expect(out.startsWith('Checked the deposit/withdrawal logic')).toBe(true);
    expect(out).toContain('A negative amount slips past the balance check');
    expect(out).toContain('amount = -50');
    // Formal detail is present but clearly demoted to a reference section.
    expect(out).toContain('reference only');
    expect(out).toContain('.imandra/account.iml');
    // The plain part precedes the technical part.
    expect(out.indexOf('Checked the deposit')).toBeLessThan(
      out.indexOf('reference only'),
    );
  });
});
