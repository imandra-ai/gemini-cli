# Gemini CLI Project Context

Gemini CLI is an open-source AI agent that brings the power of Gemini directly
into the terminal. It is designed to be a terminal-first, extensible, and
powerful tool for developers.

## Project Overview

- **Purpose:** Provide a seamless terminal interface for Gemini models,
  supporting code understanding, generation, automation, and integration via MCP
  (Model Context Protocol).
- **Main Technologies:**
  - **Runtime:** Node.js (>=20.0.0, recommended ~20.19.0 for development)
  - **Language:** TypeScript
  - **UI Framework:** React (using [Ink](https://github.com/vadimdemedes/ink)
    for CLI rendering)
  - **Testing:** Vitest
  - **Bundling:** esbuild
  - **Linting/Formatting:** ESLint, Prettier
- **Architecture:** Monorepo structure using npm workspaces.
  - `packages/cli`: User-facing terminal UI, input processing, and display
    rendering.
  - `packages/core`: Backend logic, Gemini API orchestration, prompt
    construction, and tool execution.
  - `packages/a2a-server`: Experimental Agent-to-Agent server.
  - `packages/sdk`: Programmatic SDK for embedding Gemini CLI capabilities.
  - `packages/devtools`: Integrated developer tools (Network/Console inspector).
  - `packages/test-utils`: Shared test utilities and test rig.
  - `packages/vscode-ide-companion`: VS Code extension pairing with the CLI.

## Building and Running

- **Install Dependencies:** `npm install`
- **Build All:** `npm run build:all` (Builds packages, sandbox, and VS Code
  companion)
- **Build Packages:** `npm run build`
- **Run in Development:** `npm run start`
- **Run in Debug Mode:** `npm run debug` (Enables Node.js inspector)
- **Bundle Project:** `npm run bundle`
- **Clean Artifacts:** `npm run clean`

## Testing and Quality

- **Test Commands:**
  - **Unit (All):** `npm run test`
  - **Integration (E2E):** `npm run test:e2e`
  - > **NOTE**: Please run the memory and perf tests locally **only if** you are
    > implementing changes related to those test areas. Otherwise skip these
    > tests locally and rely on CI to run them on nightly builds.
  - **Memory (Nightly):** `npm run test:memory` (Runs memory regression tests
    against baselines. Excluded from `preflight`, run nightly.)
  - **Performance (Nightly):** `npm run test:perf` (Runs CPU performance
    regression tests against baselines. Excluded from `preflight`, run nightly.)
  - **Workspace-Specific:** `npm test -w <pkg> -- <path>` (Note: `<path>` must
    be relative to the workspace root, e.g.,
    `-w @google/gemini-cli-core -- src/routing/modelRouterService.test.ts`)
- **Full Validation:** `npm run preflight` (Heaviest check; runs clean, install,
  build, lint, type check, and tests. Recommended before submitting PRs. Due to
  its long runtime, only run this at the very end of a code implementation task.
  If it fails, use faster, targeted commands (e.g., `npm run test`,
  `npm run lint`, or workspace-specific tests) to iterate on fixes before
  re-running `preflight`. For simple, non-code changes like documentation or
  prompting updates, skip `preflight` at the end of the task and wait for PR
  validation.)
- **Individual Checks:** `npm run lint` / `npm run format` / `npm run typecheck`

## Development Conventions

- **Contributions:** Follow the process outlined in `CONTRIBUTING.md`. Requires
  signing the Google CLA.
- **Pull Requests:** Keep PRs small, focused, and linked to an existing issue.
  Always activate the `pr-creator` skill for PR generation, even when using the
  `gh` CLI.
- **Commit Messages:** Follow the
  [Conventional Commits](https://www.conventionalcommits.org/) standard.
- **Imports:** Use specific imports and avoid restricted relative imports
  between packages (enforced by ESLint).
- **License Headers:** For all new source code files (`.ts`, `.tsx`, `.js`),
  include the Apache-2.0 license header with the current year. (e.g.,
  `Copyright 2026 Google LLC`). This is enforced by ESLint.

## Testing Conventions

- **Environment Variables:** When testing code that depends on environment
  variables, use `vi.stubEnv('NAME', 'value')` in `beforeEach` and
  `vi.unstubAllEnvs()` in `afterEach`. Avoid modifying `process.env` directly as
  it can lead to test leakage and is less reliable. To "unset" a variable, use
  an empty string `vi.stubEnv('NAME', '')`.

## Documentation

- Always use the `docs-writer` skill when you are asked to write, edit, or
  review any documentation.
- Documentation is located in the `docs/` directory.
- Suggest documentation updates when code changes render existing documentation
  obsolete or incomplete.

## Reasoning about code with Imandra / CodeLogician

This project ships an `formalreasoning` subagent (backed by the `codelogician`
tool / `codelogician-lite` CLI). It reasons about code mathematically and is
valuable for **two** things: _understanding_ what code does and _verifying_ that
it is correct.

**This is a hard requirement, not a suggestion:** whenever you write or modify
code that contains non-trivial program logic, you **MUST** delegate to the
`formalreasoning` subagent before you consider the task done. Do **not** ask the
user for permission first, and do **not** stop at running the code or writing
hand-rolled tests — invoke `formalreasoning` as a normal step of the work.

- **Region decomposition for understanding & tests (use this generously).**
  CodeLogician's region decomposition enumerates a function's disjoint
  behavioral cases — each with its input constraints, simplified output, and an
  example input. Delegate to the `formalreasoning` subagent to:
  - **Understand non-trivial logic, including code you just generated** — read
    the regions to confirm what the code _actually_ does, branch by branch,
    instead of trusting a statistical read. This routinely surfaces unhandled
    cases.
  - **Generate high-coverage tests** — derive one test per region (Python /
    TypeScript) so coverage tracks the real control/data flow, not guessed
    inputs. Prefer this over hand-written tests for logic-heavy functions.
- **Verification for correctness.** You MUST also delegate when a change affects
  logic that _must_ hold — algorithms, state machines, arithmetic/money,
  parsing, access control, invariants, edge cases. You get a proof or a concrete
  counterexample instead of a statistical guess.
- **The only exception** is purely cosmetic or subjective work — styling,
  colors, layout, copy, formatting, comments, logging, or "which option looks
  nicer". There is nothing to understand or verify there, so don't invoke it.
- **Don't over-invoke within that rule.** One focused decomposition/verification
  on the function that actually matters beats blanket runs; if a change is
  trivial or has no checkable behavior, skip it. But when real logic is
  involved, running `formalreasoning` is mandatory, not optional.
- The `AfterTool` hook (`.gemini/hooks/imandra-nudge.sh`) will remind you after
  source edits; treat that reminder as a direct instruction to invoke
  `formalreasoning` on the logic you just changed.
