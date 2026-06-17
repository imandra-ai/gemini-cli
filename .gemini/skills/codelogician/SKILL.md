---
name: codelogician
description: Use IML (Imandra Modeling Language) / ImandraX to reason about software engineering (programs and specifications) - formal verification, theorem proving, counter-example generation, region decomposition / test-case generation, etc. Read me whenever you see mentioning of IML / Imandra / CodeLogician.
---

# CodeLogician

## Concepts
- CodeLogician: agent that utilize IML/ImandraX to reason about programs and their properties (specifications).
- IML (Imandra Modeling Language), a formalized Higher-Order subset of OCaml extended with theorem proving tactics and verification annotations. ImandraX is the reasoning engine that powers IML.
- Verification: a process of proving a goal (some properties) or finding a counter-example if the goal is not satisfied. The process can be fully automated or interactive (guided with tactics).
- Region decomposition is a powerful feature of ImandraX for analyzing the state-space of functions. It automatically partitions a function’s input domain into disjoint regions, each characterized by a set of constraints and a corresponding simplified invariant behavior of the function within that region. Test cases can be further generated from these regions.
- `codelogician` / `codelogician-lite` CLI: the preferred way for file-system-based agents to interact with ImandraX through LLM-friendly interface.

## Typical workflow when working with IML
- Write IML code, corresponding to your specification or program to be verified / tested. Admit IML code with ImandraX and correct type errors if any.
- Based on requirements, resort to corresponding commands or annotations to invoke ImandraX:
  - Option 1. Verification (prove a goal or find a counter-example)
    - Use `verify <func>` / `instance <func>`, which are dual to each other, with the former attempts to prove the goal and return a counter-example if it fails, and the latter attempts to find a counter-example and return it if it succeeds.
    - For more general theorem proving, especially with tactics, use `theorem <name> <vars> = <body>`, `lemma <name> <vars> = <body>`, and `axiom <name> <vars> = <body>`.
  - Option 2. Region decomposition / Enumerative analysis / Test-case generation
    - Use `[@@decomp top <decomp-args> ()]` attached to function definitions to invoke region decomposition.
    - Generate test cases (Python or TypeScript) from regions with subcommands in `codelogician` CLI.

- To type-check, invoke verification, or invoke region decomposition, you pass your IML code to ImandraX via `codelogician-lite` CLI. `codelogician-lite` CLI is designed to be used by file-system-based agents with a LLM-friendly interface.
  - The most important and frequently used subcommand is `check [IML-FILE]`, which tries to type-check and admit all structures in the file.
  - Use `check-vg` / `check-decomp` with `--index` option to pass specific VGs or decompositions to check (after `check` emits no errors).


## Getting started

To get started up to speed with IML, read the top-level guide on [IML syntax](iml-syntax.md) and the `codelogician-lite` CLI ([codelogician-cli.md](codelogician-cli.md)). That should be enough to equipped you with the knowledge to write IML code and learn-by-doing. 

Check out import syntax for modular development.

Only when encountering tasks related to verification, region-decomp, or tactic-based proofs, refer to corresponding guides.

Tips: 
- A tip for explorative development is to use heredoc to pass a IML snippet to `check` for quick testing. For example:
```bash
cat <<'EOF' | codelogician-lite check -
let f x = x + 1
EOF
```
  - Note: stdin `check` doesn't support import syntax

## More in-depth references in skill directory

Along with `SKILL.md` (this file), we have the following markdown materials:

```tree
./
├── advanced/ # Advanced topics and tips
│   ├── avoid-higher-order-functions-in-proofs.md # Notes on potential issues with higher-order functions like List.map in IML proofs
│   ├── contingency-corner.md # Documentations that are unlikley to be useful for file-system-based agents.
│   ├── full-verification-guide.md # Full verification guide for ImandraX, including tactic usage.
│   ├── opaque-functions.md # Notes on using opaque functions in IML to mock functionality
│   ├── proof-tips.md # Practical tips for writing proofs in IML.
│   ├── region-decomp-advanced-features.md # Advanced features in Region Decomposition, including composition operators and refiners
│   └── termination-proving.md # Termination proving using [@@measure ...] and the Ordinal module
├── error-fix-data/ # Data for common error and fix
│   └── README.md # IML error and fixes database. Provides `error_corpus.json`, a collection of common IML errors and their fixes. Search it using jq or grep to find relevant errors and their fixes.
├── examples/ # Worked examples
│   └── basic-iml-syntax.md
├── extended-prelude/
│   └── README.md # Additional prelude functions, general purpose utilities. Including Int_conv, LChar_utils, etc. Copy paste the whole directory into your project and then import the modules you need.
├── reference/ # Language and API reference
│   ├── prelude/ # Module-level API docs
│   │   ├── Int.md
│   │   ├── LChar.md
│   │   ├── LString.md
│   │   ├── List.md
│   │   ├── Map.md
│   │   ├── Multiset.md
│   │   ├── Option.md
│   │   ├── Real.md
│   │   ├── Result.md
│   │   ├── Set.md
│   │   ├── String.md
│   │   └── top-level.md
│   ├── all-prelude-module-signatures.md # Signatures of all modules in IML prelude
│   ├── ordinal.md # Reference for ordinals used in termination proofs
│   └── tactics.md # Complete reference for all proof tactics
├── SKILL.md
├── codelogician-cli.md # Guide for using the `codelogician-lite` CLI to interact with ImandraX and access additional features.
├── iml-syntax.md # IML syntax guide, highlighting its difference with OCaml, some examples, and tips and pitfalls.
├── import-syntax.md # Import syntax in IML. For multi-file (multi-module) projects. Also useful to separate (1) types and functions definition from (2) VGs and region-decompositions.
├── region-decomp-intro.md # Intro to region decomposition, including concept explanations, basic usage, and common errors.
├── unit-testing.md # Writing unit tests in IML using verify with ground_eval and expand. Very useful for incrementally building up IML projects.
└── verification-with-verify-and-instance.md # Verify (prove a goal or find a counter-example) using `verify` and `instance` commands
```

Note: there are some *.iml examples and *.json files as well that are not shown in the tree. Find them yourself if needed.