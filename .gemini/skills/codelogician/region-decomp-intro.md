---
name: region-decomp-intro
description: Intro to region decomposition, including concept explanations, basic usage, and common errors.
---

# Intro to Region Decomposition

## Core Concepts

- **Decomposition Goal**: To break down a function `f` into a set of regions `[ {cs_0, inv_0}, {cs_1, inv_1}, ..., {cs_m, inv_m} ]` such that the function's body is equivalent to `if cs_0 then inv_0 else if cs_1 then inv_1 ... else inv_m` over the relevant input domain.
- **Regions**: Each region consists of:
  - **Constraints (`cs`)**: A list of Boolean terms representing conditions on the function's inputs. Logically, these constraints within a single region form a conjunction (AND). The constraint language avoids complex control flow like `ITE` or `match` expressions.
  - **Invariant (`inv`)**: The simplified symbolic expression representing the function's output when the region's constraints are satisfied.
- **Disjointness & Coverage**: For a decomposition generated directly by `top` (without `~assuming`), the regions are typically disjoint (an input satisfies the constraints of at most one region), and together they cover the function's entire input domain. However, subsequent manipulation using composition operators (like `<<`, `~|`, etc.) might result in overlapping regions. Furthermore, using the `~assuming` option restricts the analysis, meaning the regions only cover the portion of the input domain where the assumption holds. The decomposition aims to represent the covered domain's behavior in a DNF-like structure based on its input conditions.
- **Feasibility & Models**: The constraints of each region can be checked for satisfiability. If feasible, a concrete model (an example input satisfying the constraints) can often be extracted.
  - This concrete model can be further transformed into a test case using `codelogician` CLI.

## Basic Usage

The `top` function from the `Decomp` module is the primary way to initiate decomposition. It starts the process and accepts several optional configuration arguments:

Type signature of `top`:
```iml
val top :
  ?assuming:identifier ->
  ?basis:identifier list ->
  ?rule_specs:identifier list ->
  ?prune:bool ->
  ?ctx_simp:bool ->
  unit ->
  m
```

- **Basic Invocation**:

  ```iml
  let f x = if x = 1 || x = 2 then x + 1 else x - 1
  [@@decomp top ()]
  (* Produces regions based on conditions x=1, x=2, etc. *)
  ```

- **`~assuming`**: Decomposes the function under an additional assumption (a precondition). Takes an identifier representing a Boolean function.

  ```iml
  let asm x = x > 1
  let g x = ...
  [@@decomp top ~assuming:[%id asm] ()]
  (* Decomposes g only for inputs where asm(x) is true *)
  ```
Common Error: the additional assumption must have the exact same signature as the function being decomposed. For example:
```iml
(* WRONG - different parameters *)
let valid x = x > 0
let func x y = x + y
[@@decomp top ~assuming:[%id valid] ()]

(* CORRECT *)
let valid x y = x > 0 && y > 0
let func x y = x + y
[@@decomp top ~assuming:[%id valid] ()]
```

- **`~basis`**: Specifies a list of function identifiers that should not be expanded or interpreted during decomposition. They remain symbolic in the resulting regions.

  ```iml
  let g x = if f x > x then -1 else 1
  [@@decomp top ~basis:[ [%id f] ] ()]
  (* Decomposes g, but leaves calls to f as 'f x' *)
  ```
Common Error: the correct syntax for multiple identifiers is `[[%id f1]; [%id f2]]`, not `[%id f1; %id f2]`.

- **`~ctx_simp`**: Enables/disables contextual simplification during decomposition (e.g., value propagation, rewriting `x <> y` as `not (x = y)`).

  ```iml
  let i x y = ...
  [@@decomp top ~ctx_simp:true ()]
  ```

- **`~prune`**: Boolean flag to attempt full pruning of infeasible regions and model extraction for the feasible regions during the initial `top` step.

- **`~rule_specs`**: Specifies identifiers of rule specs to be used for rewriting or forward-chaining within the decomposition process.

## Common Errors and Anti-Patterns

**Mismatched ~assuming signature:**
```iml
(* WRONG - different parameter count *)
let valid x = x > 0
let func x y = x + y
[@@decomp top ~assuming:[%id valid] ()]

(* CORRECT *)
let valid x y = x > 0 && y > 0
let func x y = x + y
[@@decomp top ~assuming:[%id valid] ()]
```

**Exponentially large number of regions**: 
Sometimes the algorithmic complexity of a decomposed function can lead to an exponential number of regions, especially if the function has many branches or nested conditions. 
- Double-check what is the desired target of region decomposition. If the goal is only a subset of the function's behavior, consider using `~basis` or `~assuming` to restrict the analysis.
  - Quick fix 1: Use `~basis` to avoid expanding certain functions.
  - Quick fix 2: Use `~assuming` to restrict the analysis to a smaller input domain.
- Sometimes the type definition of a function is too loose / general, resulting in overly broad regions. For example, using `string` or `int` instead of variant types to represent a finite set of values is considered an anti-pattern.
