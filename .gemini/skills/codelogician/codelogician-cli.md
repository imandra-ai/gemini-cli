---
name: codelogician-cli
description: Guide for using the `codelogician-lite` CLI to interact with ImandraX and access additional features.
---

# `codelogician-lite` CLI

## Installation

- `codelogician-lite` can be installed by `uv tool install codelogician` or `pip install codelogician`.
- Installing `codelogician` will make both `codelogician` and `codelogician-lite` available.
  - `codelogician-lite` is recommended for file-system-based agent (Claude Code, Codex, Gemini CLI, etc.).

```
codelogician-lite --help
# codelogician --help
```

`IMANDRA_UNI_KEY` or `IMANDRAX_API_KEY` needs to be set in the environment variables.

## Usage

All commands accept a `FILE` argument (path to an IML file, or `-` to read from stdin) and a `--json` flag to output results in JSON format.

- `check [FILE] [OPTIONS]`:
  - description: Evaluate an IML file without VG and decomp.
  - options:
    - `--with-vgs`: Include verify/instance requests in evaluation (default: false).
    - `--with-decomps`: Include decomp requests in evaluation (default: false).
    - `--json`: Output results as JSON.
- `list-vg [FILE] [OPTIONS]`:
  - description: List verification goals specified by `verify` or `instance` commands in an IML file.
  - options:
    - `--json`: Output results as JSON.
- `check-vg [FILE] [OPTIONS]`:
  - description: Check verification goals specified by `verify` or `instance` commands in an IML file. Runs eval first, then checks VGs concurrently.
  - options:
    - `--index INTEGER`: Index(es) of VGs to check (0-based, repeatable). Defaults to all.
    - `--check-all`: Check all VGs (same as omitting `--index`).
    - `--json`: Output results as JSON (suppresses progress output).
- `list-decomp [FILE] [OPTIONS]`:
  - description: List decomp requests in an IML file.
  - options:
    - `--json`: Output results as JSON.
- `check-decomp [FILE] [OPTIONS]`:
  - description: Check decomp requests in an IML file. Runs eval first, then checks decomps concurrently.
  - options:
    - `--index INTEGER`: Index(es) of decomp requests to check (0-based, repeatable). Defaults to all.
    - `--check-all`: Check all decomp requests (same as omitting `--index`).
    - `--json`: Output results as JSON (suppresses progress output).
- `gen-test`:
  - description: Generate test cases in Python / TypeScript from region decomp in IML. Only available on macOS and Linux.

Refer to `--help` for most up-to-date usage docs.

## Tips

### Possible `check` results
The most important command is `codelogician-lite check <file.iml>`.
- It tries to compile and admit all structures in the file.
- Possible outcomes:
  - 1. syntax error
  - 2. no syntax error: `Eval success` will be printed
    - 2.1 not proved: subgoals will be printed
    - 2.2 proved: no other output
  - 3. `ImandraX internal error`: could be an actual bug in ImandraX but usually it's because of validation error (proof-related)

### Store JSON for later programmatic interaction

It can he helpful to store the JSON output of the command you are running for later programmatic interaction, e.g., to use `jq` to filter or manipulate the output. Reasons for doing so include:
- Some commands (e.g., `check-decomp` for a function with large state-space) can take a long time to run
- Some results are convoluted and need to be filtered or manipulated for further analysis
- Parallizing multiple commands (e.g., `check-vg` and `check-decomp` for different index) can be useful
