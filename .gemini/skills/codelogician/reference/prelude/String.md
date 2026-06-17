# Module `String`

17 entries


`t`
- Signature: `type String.t = string`
- Doc: These strings correspond to OCaml native strings, and do not have a particular unicode encoding. Rather, they should be seen as sequences of bytes, and it is also this way that Imandra considers them.


`empty`
- Signature: `val empty : string`
- Doc: Returns an empty string


`length`
- Signature: `val length : String.t -> int`
- Doc: Length of the string, i.e. its number of bytes


`append`
- Signature: `val append : String.t -> String.t -> String.t`
- Doc: String concatenation


`concat`
- Signature: `val concat : string -> String.t list -> string`
- Doc: [concat sep l] concatenates strings in [l] with [sep] inserted between each element. - [concat sep [] = ""]
- [concat sep [x] = x]
- [concat sep [x;y] = x ^ sep ^ y]
- [concat sep (x :: tail) = x ^ sep ^ concat sep tail]


`prefix`
- Signature: `val prefix : String.t -> String.t -> bool`
- Doc: [prefix a b] returns [true] iff [a] is a prefix of [b] (or if [a=b])


`suffix`
- Signature: `val suffix : String.t -> String.t -> bool`
- Doc: [suffix a b] returns [true] iff [a] is a suffix of [b] (or if [a=b])


`contains`
- Signature: `val contains : String.t -> String.t -> bool`
- Doc: [String.contains s1 s2] tests if [s2] appears as a substring within [s1]


`unsafe_sub`
- Signature: `val unsafe_sub : String.t -> int -> int -> String.t`
- Doc: [String.unsafe_sub s pos len] extracts substring of [s] starting at [pos] of length [len]. No bounds checking - use [String.sub] for safe substring extraction


`sub`
- Signature: `val sub : string -> int -> int -> String.t option`
- Doc: [String.sub s i len] returns the string [s[i], s[i+1],…,s[i+len-1]].


`of_int`
- Signature: `val of_int : int -> string`
- Doc: String representation of an integer


`unsafe_to_nat`
- Signature: `val unsafe_to_nat : String.t -> int`
- Doc: [String.unsafe_to_nat s] converts string [s] to natural number without validation. Use [String.to_nat] for safe conversion


`to_nat`
- Signature: `val to_nat : string -> int option`
- Doc: Parse a string into a nonnegative number, or return [None]


`is_nat`
- Signature: `val is_nat : string -> bool`
- Doc: [String.is_nat s] tests if string [s] represents a valid natural number


`is_int`
- Signature: `val is_int : string -> bool`
- Doc: [String.is_int s] tests if string [s] represents a valid integer


`unsafe_to_int`
- Signature: `val unsafe_to_int : string -> int`
- Doc: [String.unsafe_to_int s] converts string [s] to integer without validation. Use [String.to_int] for safe conversion


`to_int`
- Signature: `val to_int : string -> int option`
- Doc: [String.to_int s] safely converts string [s] to integer. Returns None if [s] is not a valid integer

