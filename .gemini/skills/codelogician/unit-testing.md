---
name: unit-testing
description: Writing unit tests in IML using verify with ground_eval and expand. Very useful for incrementally building up IML projects.
---

# Unit Testing in IML

Unit testing in IML is done via `verify` combined with the `ground_eval` tactic. This lets you assert concrete, fully-determined facts and have ImandraX prove them by direct evaluation — no SMT solving or induction needed.

## Basic pattern

```iml
verify (<concrete boolean expression>) [@@by ground_eval ()]
```

`ground_eval ()` evaluates the expression directly (like `eval` would) and checks the result is `true`. It is fast and deterministic for fully concrete inputs.

```iml
(* Value equality *)
verify (1 + 1 = 2) [@@by ground_eval ()]

(* Function application *)
verify (List.length [1; 2; 3] = 3) [@@by ground_eval ()]

(* Boolean result *)
verify (List.mem 2 [1; 2; 3]) [@@by ground_eval ()]
```

## Inline expressions or use `expand`

`ground_eval` operates on the goal as-is and does **not** unfold/expand named function references. When the goal contains `f _x`, it sees an opaque function call rather than a concrete expression it can evaluate.

This means the following styles work:

```iml
(* WORKS — expression is inline *)
verify (1 + 1 = 2) [@@by ground_eval ()]

(* WORKS — anonymous function is equivalent to inline *)
verify (fun () -> 1 + 1 = 2) [@@by ground_eval ()]
```

For named functions, `ground_eval` alone won't work because it sees an opaque call. Use `expand` to inline the function body first:

```iml
let f () = 1 + 1 = 2

(* ground_eval alone — fails, sees opaque `f _x` *)
verify f [@@by ground_eval ()]

(* expand first, then ground_eval — works *)
verify f [@@by expand "f" @> ground_eval ()]
```

Both the inline style and the `expand @> ground_eval` style are perfectly valid. The inline style is more concise for one-off assertions; the named-function style is useful when you want to reuse or reference the test expression elsewhere.
