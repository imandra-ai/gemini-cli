# Module `LString`

18 entries


`t`
- Signature: `type t = LChar.t list`
- Doc: A list of logic-mode characters


`empty`
- Signature: `val empty : LChar.t list`
- Doc: Returns an empty string (empty list of characters)


`of_list`
- Signature: `val of_list : 'a -> 'a`
- Doc: Converts a list directly to an LString.t


`length`
- Signature: `val length : LChar.t list -> int`
- Doc: Returns the number of characters in string [s]


`append`
- Signature: `val append : LChar.t list -> LChar.t list -> LChar.t list`
- Doc: Concatenates strings [s1] and [s2]


`^^`
- Signature: `val (^^) : LChar.t list -> LChar.t list -> LChar.t list`
- Doc: An infix operator alias for LString.append


`for_all`
- Signature: `val for_all : (LChar.t -> bool) -> LChar.t list -> bool`
- Doc: Tests if all characters in [s] satisfy predicate [f]


`exists`
- Signature: `val exists : (LChar.t -> bool) -> LChar.t list -> bool`
- Doc: Tests if any character in [s] satisfies predicate [f]


`concat`
- Signature: `val concat : LChar.t list -> LChar.t list list -> LChar.t list`
- Doc: Concatenates all strings in list [l], placing [sep] between each


`is_printable`
- Signature: `val is_printable : LChar.t list -> bool`
- Doc: Tests if all characters in [s] are printable


`sub`
- Signature: `val sub : LChar.t list -> int -> int -> LChar.t list`
- Doc: Extracts substring of [s] starting at position [i] of length [len]


`prefix`
- Signature: `val prefix : LChar.t list -> LChar.t list -> bool`
- Doc: Tests if [s1] is a prefix of [s2]


`suffix`
- Signature: `val suffix : LChar.t list -> LChar.t list -> bool`
- Doc: Tests if [s1] is a suffix of [s2]


`contains`
- Signature: `val contains : LChar.t list -> LChar.t list -> bool`
- Doc: Tests if [s2] appears as a substring within [s1]


`take`
- Signature: `val take : int -> LString.t -> LString.t`
- Doc: Returns first [n] characters of string [s]. The [LString.t] version of [List.take]


`drop`
- Signature: `val drop : int -> LString.t -> LString.t`
- Doc: Removes first [n] characters from string [s]. The [LString.t] version of [List.drop]


`len_pos`
- Signature: `val len_pos : LChar.t list -> bool`
- Doc: The length of a string is always non-negative


`len_zero_inversion`
- Signature: `val len_zero_inversion : LChar.t list -> bool`
- Doc: If the length of a string is zero, then the string is empty

