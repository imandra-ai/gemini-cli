# Module `Int`

20 entries


`t`
- Signature: `type t = int`
- Doc: Integer type using arbitrary precision integers (Z.t from Zarith)


`mod_zero_prod`
- Signature: `val mod_zero_prod : int -> int -> int -> bool`


`mod_sub_id`
- Signature: `val mod_sub_id : int -> int -> bool`


`/`
- Signature: `val (/) : int -> int -> int`
- Doc: Division operator for integers


`mod`
- Signature: `val (mod) : int -> int -> int`
- Doc: Modulo operator for integers


`<`
- Signature: `val (<) : int -> int -> bool`
- Doc: Less than comparison operator


`+`
- Signature: `val (+) : int -> int -> int`
- Doc: Addition operator for integers


`-`
- Signature: `val (-) : int -> int -> int`
- Doc: Subtraction operator for integers


`~-`
- Signature: `val (~-) : int -> int`
- Doc: Unary negation operator for integers


`*`
- Signature: `val (*) : int -> int -> int`
- Doc: Multiplication operator for integers


`<=`
- Signature: `val (<=) : int -> int -> bool`
- Doc: Less than or equal comparison operator


`>`
- Signature: `val (>) : int -> int -> bool`
- Doc: Greater than comparison operator


`>=`
- Signature: `val (>=) : int -> int -> bool`
- Doc: Greater than or equal comparison operator


`min`
- Signature: `val min : int -> int -> int`
- Doc: Returns the minimum of two integers


`max`
- Signature: `val max : int -> int -> int`
- Doc: Returns the maximum of two integers


`abs`
- Signature: `val abs : int -> int`
- Doc: Returns absolute value of an integer


`to_string`
- Signature: `val to_string : int -> string`
- Doc: Converts non-negative integer to string representation


`compare`
- Signature: `val compare : int -> int -> int`
- Doc: Returns -1 if x < y, 0 if x = y, 1 if x > y


`equal`
- Signature: `val equal : 'a -> 'a -> bool`
- Doc: Tests equality of two integers


`pow`
- Signature: `val pow : int -> int -> int`
- Doc: Computes x raised to power n
- Note-on-writing-proofs: `Int.pow` can be difficult to reason about in proofs. If you need to prove properties involving exponentiation (e.g., `2^(n+1) = 2 * 2^n`), consider defining your own `pow` function:
```iml
let rec pow (a:int) (n:int) : int =
  if n <= 0 then 1 else a * pow a (n - 1)
[@@measure (Ordinal.of_int n)] [@@by auto]
```
Then prove helper lemmas like `pow_succ` with `[@@rw]` annotations so `auto` can use them.


