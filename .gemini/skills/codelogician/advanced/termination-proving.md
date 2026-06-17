---
name: termination-proving
description: Termination proving using [@@measure ...] and the Ordinal module 
tag:
  - advanced
  - termination-proving
---

# Basic

Since IML serves as both a programming language and a logic, function termination must be provable:

- For common recursion patterns, termination is proven automatically
- For complex cases, provide explicit termination measures using `[@@measure ...]`

**Ordinals in Termination Proofs:**
Termination measures in IML must return values of type `Ordinal.t`. This type represents ordinals up to ε₀ in Cantor Normal Form, providing a well-founded ordering essential for proving termination. When defining measures, you can use functions like `Ordinal.of_int` to convert integers to ordinals, or construct more complex ordinals for nested recursion.

**Example with explicit measure:**
```iml
let left_pad_measure n xs =
  Ordinal.of_int (n - List.length xs)

let rec left_pad c n xs =
  if List.length xs >= n then
    xs
  else
    left_pad c n (c :: xs)
[@@measure left_pad_measure n xs]
```

The measure shows that `n - List.length xs` decreases with each recursive call and remains non-negative, proving termination. The `Ordinal.of_int` function converts this integer difference to an ordinal value that Imandra can use to establish a well-founded ordering.

Note that `[@@measure ...]` can only be used for top-level functions, i.e., functions that are not defined within other functions.


# More examples and practical tips

# How to Prove Termination

This guide shows you how to prove that your recursive functions terminate. Use this when ImandraX rejects a function due to termination concerns.

## Quick Decision Tree

```
Is your function rejected for termination?
├─ Does it use structural recursion on datatypes?
│   └─ Should work automatically. Check recursion structure.
├─ Does it have simple decreasing integer arguments?
│   └─ Should work automatically. Verify the decrease.
├─ Do arguments decrease lexicographically?
│   └─ Use [@@adm arg1, arg2, ...]
└─ Need custom measure?
    └─ Use [@@measure fn arg1 arg2 ...]
```

## Approach 1: Rely on Automatic Detection

ImandraX handles these automatically:

**Structural recursion on lists:**
```iml
let rec sum_list = function
  | [] -> 0
  | x :: xs -> x + sum_list xs
(* Works automatically *)
```

**Simple decreasing integers:**
```iml
let rec countdown x =
  if x <= 0 then 0
  else x + countdown (x - 1)
(* Works automatically *)
```

NOTE: When no custom measure is given, ImandraX's heuristics will select the first argument that is tested in every branch, i.e., automatic measure synthesis will try a measure with a single argument.

## Approach 2: Lexicographic Ordering with @@adm

Use when multiple arguments decrease in order:

```iml
let rec ackermann m n =
  if m <= 0 then n + 1
  else if n <= 0 then ackermann (m - 1) 1
  else ackermann (m - 1) (ackermann m (n - 1))
[@@adm m, n]
```

This tells ImandraX: "m decreases first; when m stays the same, n decreases."

**When to use:**
- Multiple recursive calls with different decreasing patterns
- Nested recursion (like Ackermann)
- Arguments that decrease in a specific priority order

## Approach 3: Custom Measure with @@measure

Use when you need to compute a decreasing quantity:

**Step 1:** Define a measure function returning `Ordinal.t`:
```iml
let left_pad_measure n xs =
  Ordinal.of_int (n - List.length xs)
```

**Step 2:** Attach the measure to your function:
```iml
let rec left_pad c n xs =
  if List.length xs >= n then xs
  else left_pad c n (c :: xs)
[@@measure left_pad_measure n xs]
```

**Key points:**
- Measure function must return `Ordinal.t`
- Use `Ordinal.of_int` to convert integers
- Include only the arguments that affect the measure


# Last resort to bypass verification completely
As a **last resort**, `[@@no_validate]` disable verification for a function completely:

```iml
let rec left_pad c n xs =
  if List.length xs >= n then
    xs
  else
    left_pad c n (c :: xs)
[@@no_validate]
```

**Important limitation**: Using `[@@no_validate]` SIGNIFICANTLY limits Imandra's reasoning capabilities for this function.
