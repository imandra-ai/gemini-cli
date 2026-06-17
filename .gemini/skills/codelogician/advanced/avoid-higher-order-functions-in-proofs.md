---
name: avoid-higher-order-functions-in-proofs
description: Notes on potential issues with higher-order functions like List.map in IML proofs
tag:
  - advanced
  - proofs
---

# Higher-Order Functions in Proofs

Higher-order functions like `List.map`, `List.filter`, and `List.fold_left` are convenient, but they can cause issues in proofs when combined with polymorphic closures.

## The Problem: Polymorphic Closures

Consider this polymorphic `powerset` function:

```iml
let rec powerset xs =
  match xs with
  | [] -> [[]]
  | x :: rest ->
    let subsets = powerset rest in
    subsets @ List.map (fun s -> x :: s) subsets
```

This compiles fine, but proving theorems about it fails with:

```
[LowerRirError] Lower-RIR.Term: Cannot make closure from function
`List.length : 'a list list -> int` with arguments [...]:
argument has type `_a_0 list list` but type `'a list list` was expected.
```

**Why it happens:** During proof lowering, ImandraX needs to create a closure representation for `(fun s -> x :: s)`. The polymorphic type variable `'a` gets instantiated differently in different contexts (`_a_0` vs `'a`), causing a type mismatch.

## The Solution: First-Order Functions

Replace the higher-order function call with a dedicated first-order recursive function:

```iml
(* Instead of List.map (fun s -> x :: s) xss, define: *)
let rec map_cons (x : 'a) (xss : 'a list list) : 'a list list =
  match xss with
  | [] -> []
  | s :: rest -> (x :: s) :: map_cons x rest

let rec powerset (xs : 'a list) : 'a list list =
  match xs with
  | [] -> [[]]
  | x :: rest -> powerset rest @ map_cons x (powerset rest)
```

This avoids closures entirely—it's plain structural recursion that ImandraX can reason about without polymorphic closure issues.

## When This Matters

The issue specifically affects:

- **Polymorphic functions** with type variables like `'a`
- **Closures/lambdas** passed to higher-order functions
- **Proof contexts** (the code may compile but proofs fail)

Concrete (monomorphic) types work fine:

```iml
(* This works because there's no polymorphism *)
let rec powerset (xs : int list) : int list list =
  match xs with
  | [] -> [[]]
  | x :: rest ->
    let subsets = powerset rest in
    subsets @ List.map (fun s -> x :: s) subsets
```

## Guidelines

1. **Avoid inline lambdas in polymorphic functions** that need to be proven
2. **Define first-order helper functions** instead of using `List.map`/`List.filter` with closures
3. **Type annotations don't help**—the issue is in proof lowering, not type-checking
4. **Concrete types work**—if you don't need polymorphism, monomorphic versions avoid the issue

## Common Patterns

| Instead of                        | Use                                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `List.map (fun x -> x + 1) xs`    | `let rec add_one xs = match xs with [] -> [] \| x::t -> (x+1)::add_one t`                                   |
| `List.map (fun s -> x :: s) xss`  | `let rec map_cons x xss = ...` (as above)                                                                   |
| `List.filter (fun x -> x > 0) xs` | `let rec filter_pos xs = match xs with [] -> [] \| x::t -> if x > 0 then x::filter_pos t else filter_pos t` |

This is a known limitation of ImandraX's handling of polymorphic closures in the proof engine.
