---
name: ordinal-module-reference
description: Reference for ordinals used in termination proofs
---

# Ordinal Module Reference

Ordinals are used in termination proofs to show recursive calls decrease along a well-founded ordering. The following items are available in the `Ordinal` module:

## Type

```iml
type t = Int of int | Cons of t * int * t
```

Represents ordinals up to ε₀ in Cantor Normal Form.

## Creating Ordinals

| Function  | Signature               | Description                |
| --------- | ----------------------- | -------------------------- |
| `of_int`  | `int -> t`              | Convert integer to ordinal |
| `~$`      | `int -> t`              | Infix for `of_int`         |
| `pair`    | `t -> t -> t`           | Create ordinal pair        |
| `triple`  | `t -> t -> t -> t`      | Create ordinal triple      |
| `quad`    | `t -> t -> t -> t -> t` | Create ordinal quad        |
| `of_list` | `t list -> t`           | Create from list           |

## Operations

| Function     | Signature        | Description                |
| ------------ | ---------------- | -------------------------- |
| `<<`         | `t -> t -> bool` | Well-founded ordering      |
| `plus` / `+` | `t -> t -> t`    | Addition (non-commutative) |

## Constants

| Constant      | Description              |
| ------------- | ------------------------ |
| `zero`        | Ordinal 0                |
| `one`         | Ordinal 1                |
| `omega`       | First infinite ordinal ω |
| `omega_omega` | ω^ω                      |

## Examples

```iml
(* Simple measure *)
let measure n = Ordinal.of_int n

(* Lexicographic pair *)
let measure m n = Ordinal.pair ~$m ~$n

(* List length *)
let measure xs = Ordinal.of_int (List.length xs)
```
