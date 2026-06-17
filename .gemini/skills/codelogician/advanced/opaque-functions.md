---
name: opaque-functions
description: Notes on using opaque functions in IML to mock functionality
tag:
  - advanced
  - opqaue
---

# Opaque Functions

Opaque functions allow you to define function signatures without implementing their behavior in detail. Think of them as mocking funcitonalities that help we pass type checking.

# Definition

To create an opaque function, attach the `[@@opaque]` attribute to a function with an explicit type signature on the function name:

```iml
let sqrt: real -> real = () [@@opaque]
```

# Syntax Rules

1. **Type annotation placement**: The type annotation must be placed on the function name itself, not on parameters or the function body:
   - ✅ `let sqrt: real -> real = () [@@opaque]`
   - ❌ `let sqrt (x: real) : real = () [@@opaque]`

2. **Return unit**: The implementation body is a unit value `()` no matter what the type is.

# When to Use Opaque Functions

Opaque functions should be used conservatively when:
- Working with functions that aren't yet expressible in IML (e.g., operations   involving irrational numbers, bitwise operations, etc.)
- Integrating with external third-party libraries
