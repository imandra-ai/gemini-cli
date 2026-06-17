# Module `Real`

18 entries


`t`
- Signature: `type t = real`
- Doc: The real number type representing arbitrary precision real numbers


`of_int`
- Signature: `val of_int : int -> real`
- Doc: Converts an integer [i] to a real number


`_to_int_round_down`
- Signature: `val _to_int_round_down : real -> int`
- Doc: Converts a real number [r] to an integer by rounding down. Internal helper function.


`to_int`
- Signature: `val to_int : real -> int`
- Doc: Converts a real number [r] to an integer by rounding towards zero


`+`
- Signature: `val (+) : real -> real -> real`
- Doc: Adds two real numbers


`-`
- Signature: `val (-) : real -> real -> real`
- Doc: Subtracts two real numbers


`~-`
- Signature: `val (~-) : real -> real`
- Doc: Negates a real number


`*`
- Signature: `val (*) : real -> real -> real`
- Doc: Multiplies two real numbers


`/`
- Signature: `val (/) : real -> real -> real`
- Doc: Divides two real numbers


`<`
- Signature: `val (<) : real -> real -> bool`
- Doc: Tests if one real number is less than another


`<=`
- Signature: `val (<=) : real -> real -> bool`
- Doc: Tests if one real number is less than or equal to another


`>`
- Signature: `val (>) : real -> real -> bool`
- Doc: Tests if one real number is greater than another


`>=`
- Signature: `val (>=) : real -> real -> bool`
- Doc: Tests if one real number is greater than or equal to another


`abs`
- Signature: `val abs : real -> real`
- Doc: Returns the absolute value of real number [r]


`min`
- Signature: `val min : real -> real -> real`
- Doc: Returns the minimum of two real numbers


`max`
- Signature: `val max : real -> real -> real`
- Doc: Returns the maximum of two real numbers


`of_float`
- Signature: `val of_float : float -> real`
- Doc: Converts a float [f] to a real number


`pow`
- Signature: `val pow : real -> int -> real`
- Doc: Raises real number [base] to integer power [exp]

