# Imandra / CodeLogician integration

Gemini CLI ships with a built-in **Imandra agent** that brings formal,
mathematical reasoning to your coding workflow via
[Imandra / CodeLogician](https://www.codelogician.dev). Where an LLM reasons
statistically, Imandra reasons with logic: it builds a precise model of your
code and uses the **ImandraX** engine to _prove_ properties (or produce a
concrete counterexample), to _decompose_ a function into its disjoint behavioral
regions, and to _generate_ high-coverage tests from those regions.

## What you get

Two pieces are added to the CLI:

- **The `formalreasoning` subagent** — an "Imandra coding agent" that
  autoformalizes the relevant parts of your source code into IML (Imandra
  Modeling Language), drives the analysis, and maps the results back to your
  code with concrete, source-level recommendations.
- **The `codelogician` tool** — a structured wrapper around the
  `codelogician-lite` CLI that talks to the ImandraX engine. It exposes the
  operations `check`, `list_vg` / `check_vg`, `list_decomp` / `check_decomp`,
  and `gen_test`.

## When it activates automatically

The main agent delegates to the `formalreasoning` subagent when it would add
value:

- **Code comprehension** — region decomposition enumerates a function's disjoint
  behavioral cases (constraints + output + example input per region), giving a
  precise, branch-by-branch map of what code actually does. This is especially
  useful for understanding **code the agent just generated**, rather than
  trusting a statistical read of it.
- **High-coverage test generation** — `gen_test` derives one test per region, so
  coverage tracks the real control/data flow instead of guessed inputs.
- **Property verification** — when code has invariants or properties worth
  formally verifying (autoformalize → verify, get concrete counterexamples).
- **Proactively after writing/editing critical code** — to confirm behavior and
  catch edge cases that statistical reasoning would miss.

You can also invoke it explicitly with `@formalreasoning`, for example:

```
@formalreasoning Verify that `applyDiscount` never produces a negative total, and
decompose its behavior into regions.
```

## Setup

1. Install the CodeLogician CLI (this provides both `codelogician` and
   `codelogician-lite`):

   ```bash
   uv tool install codelogician
   # or: pip install codelogician
   ```

2. Get an Imandra Universe API key (a free starting plan is available) at
   https://universe.imandra.ai and export it:

   ```bash
   export IMANDRA_UNI_KEY="<your-key>"   # IMANDRAX_API_KEY also works
   ```

The `formalreasoning` agent and the `codelogician` tool are registered
**automatically when the `codelogician-lite` binary is found on `PATH`**. If it
is not installed, neither is surfaced, so users without CodeLogician are
unaffected.

## How it works

The agent follows an autoformalization loop:

1. Read the target source code and identify the function(s) and
   properties/behaviors of interest.
2. Translate the relevant logic into IML in a workspace file under `.imandra/`.
3. `check` the model with ImandraX and fix any type errors.
4. Add `verify` / `instance` goals and/or `[@@decomp top ()]` requests, then run
   `check_vg` / `check_decomp`. Optionally `gen_test` to emit tests.
5. Map counterexamples and region constraints back to the original source and
   report findings.

## The `codelogician` tool

| `operation`    | Description                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `check`        | Type-check and admit all structures in an IML file. Run this first and fix errors.               |
| `list_vg`      | List the verification goals (`verify` / `instance`) in a file.                                   |
| `check_vg`     | Execute verification goals. Returns `proved` / `refuted` (with a counterexample) / `unknown`.    |
| `list_decomp`  | List region-decomposition requests (`[@@decomp ...]`).                                           |
| `check_decomp` | Execute region decomposition. Returns the disjoint regions (constraints + invariant + examples). |
| `gen_test`     | Generate test cases (e.g. Python / TypeScript) from a function's region decomposition.           |

Use `index` (or `check_all`) with `check_vg` / `check_decomp` to target specific
goals, and `function` + `lang` with `gen_test`.

## Disabling it

Because both pieces are gated on the presence of `codelogician-lite`, the
simplest way to disable them is to ensure the binary is not on `PATH`. You can
also disable the subagent explicitly in `settings.json`:

```json
{
  "agents": {
    "overrides": {
      "formalreasoning": { "enabled": false }
    }
  }
}
```

## Reference docs (bundled skill)

The canonical IML / ImandraX documentation (syntax, verification and
region-decomposition guides, tactics, prelude reference, and an error→fix
corpus) is shipped as a skill at `.gemini/skills/codelogician/`, produced by
`codelogician doc dump`. The `formalreasoning` agent reads from there instead of
working from memory.

When you upgrade the CodeLogician CLI, refresh the bundled docs so they stay in
sync with the installed binary:

```bash
npm run skill:codelogician   # re-dumps docs and stamps CODELOGICIAN_VERSION
```

The current bundled version is recorded in
`.gemini/skills/codelogician/CODELOGICIAN_VERSION`.

## Learn more

- CodeLogician: https://www.codelogician.dev
- Imandra Universe (API keys): https://universe.imandra.ai
- [Subagents](../core/subagents.md)
