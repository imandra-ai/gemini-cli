---
name: region-decomp-advanced-features
description: Advanced features in Region Decomposition, including composition operators and refiners
---
# Advanced Features in Region Decomposition

## Composition Operators

The `[@@decomp ...]` syntax allows chaining operations using operators defined in the `Decomp` module to build more complex analysis pipelines:

- **`m |>> f` (Apply Refiner)**: Takes the result of a decomposition `m` (e.g., from `top ()`) and applies a refiner function `f` to it. This is the main way to chain steps like pruning or enumeration.

  ```iml
  let f' = f [@@decomp top () |>> prune]
  ```

- **`m << d1` (Merge)**: Merges the decomposition `d1` into `m`. This effectively substitutes the definition of the function decomposed in `d1` wherever it appears in the regions of `m`, re-calculating regions accordingly.

  ```iml
  (* Concept: Decompose g, then merge f's definition into it *)
  let d_g_merged_f = g [@@decomp top ~basis:[ [%id f] ] () << top () [%id f ]]
  ```

- **`m <|< d1` (Compound Merge)**: A specialized merge that combines merging (`<<`) and combining (`~|`, see below) but preserves certain region distinctions from `m`.

  ```iml
  let d_g_compound_f = g [@@decomp top ~basis:[ [%id f] ] () <|< top () [%id f ]]
  ```

- **`~| m` (Combine)**: Takes a decomposition `m` and merges regions that have the exact same invariant, creating a disjunction (OR) of their constraints.

  ```iml
  let d_g_combined = ... [@@decomp ~| (top ~basis:[ [%id f] ] ())]
  ```

## Key Refiners (Used with `|>>`)

These functions from the `Decomp` module modify an existing decomposition:

- **`prune`**: Attempts to identify and remove infeasible regions (those whose constraints are unsatisfiable).

  ```iml
  let h a = ...
  let d_h_pruned = h [@@decomp top () |>> prune ]
  ```

- **`enumerate` / `enumerate_all`**: Refiners used for specific enumeration tasks, potentially related to generating test data satisfying region constraints. `enumerate_all` takes a list of decompositions and a style (`Additive` or `Multiplicative`).

  ```iml
  let en' = en [@@decomp top () |>> enumerate_all ~style:Additive [ ... ]]
  let en'' = en [@@decomp top () |>> enumerate_all ~style:Multiplicative [ ... ]]
  ```

- **`merge_` / `compound_merge_`**: The underlying refiners used by the `<<` and `<|<` operators respectively.

### Rule Specifications (`~rule_specs`)

You can provide background axioms or lemmas (marked `[@@imandra_rule_spec]`) via the `~rule_specs` argument to `top`. These rules are applied during decomposition for:

- **Rewriting**: Simplifying terms within constraints or invariants.
- **Forward Chaining**: Adding derived facts to a region's context, potentially aiding feasibility checking or further simplification.

```iml
let map_recons len f x = ... [@@rw] [@@imandra_rule_spec]
let map_cons_eval f x y = ... [@@rw] [@@imandra_rule_spec]

let d_tgt''_rs = tgt''
  [@@decomp top ~assuming:[%id asm'']
                  ~rule_specs:[ [%id map_recons]; [%id map_cons_eval] ] ()]
```
