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

# Skip the formalreasoning subagent's own IML workspace (.imandra/, prevents
# loops) and tests/snapshots, which are not the thing we want to formalize.
case "$file" in
  .imandra/* | */.imandra/* | *.test.* | *.spec.* | *.snap | */__snapshots__/*)
    emit_noop
    ;;
esac

# Classify the file: hand-written IML gets an IML-specific nudge; program-logic
# source gets the formalize/verify nudge; everything else (markup, styles,
# config, docs) is skipped.
case "$file" in
  *.iml) kind="iml" ;;
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.py | *.ml | *.mli | *.go | *.rs | *.java | *.c | *.cc | *.cpp | *.h | *.hpp | *.scala | *.kt | *.rb) kind="code" ;;
  *) emit_noop ;;
esac

# Throttle: nudge at most once per file per session, so iterative editing of the
# same file does not re-trigger formal reasoning on every save.
sess="${GEMINI_SESSION_ID:-nosession}"
marker_dir="${TMPDIR:-/tmp}/codelogician-nudge-${sess}"
key="$(printf '%s' "$file" | tr -c 'a-zA-Z0-9' '_')"
marker="${marker_dir}/${key}"
[ -e "$marker" ] && emit_noop
mkdir -p "$marker_dir" 2>/dev/null || true
: >"$marker" 2>/dev/null || true

# Inject the directive. The model still decides relevance and timing: delegate
# ONCE, after the logic is settled — not on every intermediate edit.
node -e '
const f = process.argv[1];
const kind = process.argv[2];
const msg = kind === "iml"
  ? `You edited the IML file \`${f}\`. Hand-written IML must be checked: admit it ` +
    `with the \`codelogician\` tool (operation \`check\`) and fix any errors, then ` +
    `run \`check_vg\` / \`check_decomp\` for any goals or decompositions involved. ` +
    `For authoring or verifying IML, prefer delegating to the \`formalreasoning\` ` +
    `subagent. Do not leave IML unadmitted.`
  : `You edited \`${f}\`. Once you have finished a non-trivial piece of program ` +
    `logic here (algorithms, state machines, arithmetic/money, parsing, access ` +
    `control, invariants, edge cases), delegate ONCE to the \`formalreasoning\` ` +
    `subagent to understand it via region decomposition and verify the properties ` +
    `that matter (it returns concrete counterexamples). Do this a single time, ` +
    `after the logic has settled — not after every intermediate edit, and not for ` +
    `trivial changes. Skip it entirely for cosmetic/subjective work (styling, ` +
    `colors, copy, formatting, comments, logging).`;
process.stdout.write(JSON.stringify({ hookSpecificOutput: { additionalContext: msg } }));
' "$file" "$kind"
