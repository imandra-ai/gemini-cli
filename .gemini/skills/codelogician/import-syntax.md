---
name: import-syntax
description: Import syntax in IML. For multi-file (multi-module) projects. Also useful to separate (1) types and functions definition from (2) VGs and region-decompositions.
---

# Import Syntax

## Syntax
1. Path Imports with Implicit Module Names:

```iml
[@@@import "path/to/file.iml"]
```

This syntax makes definitions from the imported file available with quantified name, e.g., `File.<def_name>`.

- `open File` can be used to bring definitions from the imported file into the current scope without quantification after the import statement.

2. Path Imports with Explicit Module Names:

```iml
[@@@import Mod_name, "path/to/file.iml"]
```


## Evaluating IML with Imports in `codelogician` CLI

When evaluating a IML file which has imports inside in `check`, `check-vg`, or `check-decomp`, the CodeLogician CLI will resolve the imports and aggregate all the IML files into a monolithic IML file in topological order.
