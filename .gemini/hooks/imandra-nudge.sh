#!/usr/bin/env bash
#
# AfterTool hook: after a source file is edited, remind the agent to formally
# check it with Imandra/CodeLogician — but only when it makes sense.
#
# The hook fires deterministically on every write_file/replace. It filters out
# files that are obviously not logic (docs, styles, config, generated/test
# files, and the agent's own .iml models, to avoid loops). For real source
# edits it injects a directive that hands the *relevance* judgment to the model:
# verify logic/correctness changes, skip purely cosmetic/subjective ones.
#
# Contract: read the AfterTool JSON payload on stdin, print exactly one JSON
# object on stdout (nothing else), exit 0. See docs/hooks/reference.md.

set -euo pipefail

payload="$(cat || true)"

# Extract tool_input.file_path from the payload without assuming jq is present.
file="$(printf '%s' "$payload" | node -e '
let s = "";
process.stdin.on("data", (d) => (s += d));
process.stdin.on("end", () => {
  try {
    const j = JSON.parse(s);
    process.stdout.write((j.tool_input && j.tool_input.file_path) || "");
  } catch {
    process.stdout.write("");
  }
});
' 2>/dev/null || true)"

emit_noop() { printf '%s' '{}'; exit 0; }

# Nothing to do if we could not determine the edited file.
[ -n "$file" ] || emit_noop

# Skip the agent's own IML models and anything under .imandra/ (prevents loops),
# plus tests/snapshots which are not the thing we want to formalize.
case "$file" in
  *.iml | */.imandra/* | *.test.* | *.spec.* | *.snap | */__snapshots__/*)
    emit_noop
    ;;
esac

# Only consider files that can actually contain program logic. Markup, styles,
# config, data and docs (the "is this color prettier" category) are skipped.
case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.py | *.ml | *.mli | *.go | *.rs | *.java | *.c | *.cc | *.cpp | *.h | *.hpp | *.scala | *.kt | *.rb) ;;
  *) emit_noop ;;
esac

# Inject the directive. The model still decides relevance: it should only invoke
# Imandra when the change affects behavior/correctness, not styling or copy.
node -e '
const f = process.argv[1];
const msg =
  `You just edited \`${f}\`. If this change affects program logic or behavior ` +
  `(algorithms, state machines, arithmetic/money, parsing, access control, ` +
  `invariants, edge-case handling), you MUST delegate to the \`imandra\` subagent ` +
  `NOW — before writing tests, before running the code, and before concluding ` +
  `this task. Do NOT ask the user whether to use it; just invoke it. Use it to ` +
  `(1) UNDERSTAND what the code you just wrote actually does via region ` +
  `decomposition (read the per-region behavior to confirm every branch/boundary ` +
  `is handled), (2) generate high-coverage tests from those regions, and (3) ` +
  `verify any property that must hold (getting a concrete counterexample if it ` +
  `fails). The ONLY exception is a purely cosmetic or subjective change (styling, ` +
  `colors, copy, formatting, comments, logging) — for those, do nothing.`;
process.stdout.write(JSON.stringify({ hookSpecificOutput: { additionalContext: msg } }));
' "$file"
