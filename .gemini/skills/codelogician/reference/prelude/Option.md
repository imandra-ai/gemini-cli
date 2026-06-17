# Module `Option`

21 entries


`t`
- Signature: `type 'a t = 'a option`
- Doc: The option type representing optional values. Can be either [None] representing absence of a value, or [Some x] containing a value [x] of type ['a].


`map`
- Signature: `val map : ('a -> 'b) -> 'a option -> 'b option`
- Doc: Transforms an optional value by applying function [f] to the contained value. If [x] is [None], returns [None]. If [x] is [Some v], returns [Some (f v)]. This allows transforming the value while preserving the optional structure.


`map_or`
- Signature: `val map_or : default:'a -> ('b -> 'a) -> 'b option -> 'a`
- Doc: Transforms an optional value into a definite value. If [x] is [Some v], applies [f] to [v]. If [x] is [None], returns the [default] value. This ensures a value is always returned, handling the None case with a default.


`is_some`
- Signature: `val is_some : 'a option -> bool`
- Doc: Checks if an option contains a value. Returns [true] if [x] is [Some _], [false] if [x] is [None]. Useful for checking presence of optional values without extracting them.


`is_none`
- Signature: `val is_none : 'a option -> bool`
- Doc: Checks if an option is empty. Returns [true] if [x] is [None], [false] if [x] is [Some _]. Complement of [Option.is_some].


`return`
- Signature: `val return : 'a -> 'a option`
- Doc: Wraps a value in [Some] constructor. This is the fundamental way to create an optional value containing something. Always returns [Some x] for any input [x].


`>|=`
- Signature: `val (>|=) : 'a option -> ('a -> 'b) -> 'b option`
- Doc: An infix operator version of [Option.map]. Allows writing [x >|= f] instead of [Option.map f x] for more natural composition syntax.


`flat_map`
- Signature: `val flat_map : ('a -> 'b option) -> 'a option -> 'b option`
- Doc: Applies a function that returns an option to an optional value. If [x] is [None], returns [None]. If [x] is [Some v], returns [f v]. Used for composing operations that may each produce optional results.


`>>=`
- Signature: `val (>>=) : 'a option -> ('a -> 'b option) -> 'b option`
- Doc: An infix operator version of [Option.flat_map]. Allows writing [x >>= f] instead of [Option.flat_map f x]. Standard monadic bind operator for options.


`or_`
- Signature: `val or_ : 'a option -> 'a option -> 'a option`
- Doc: Provides a fallback option. Returns [a] if it contains a value, otherwise returns [b]. Useful for providing default optional values.


`<+>`
- Signature: `val (<+>) : 'a option -> 'a option -> 'a option`
- Doc: An infix operator version of [Option.or_]. Allows writing [a <+> b] instead of [Option.or_ a b] for more natural fallback syntax.


`exists`
- Signature: `val exists : ('a -> bool) -> 'a option -> bool`
- Doc: Tests if the value in an option satisfies a predicate. Returns [false] if [x] is [None], otherwise returns [p v] where [v] is the contained value. Similar to [List.exists] but for a single optional value.


`for_all`
- Signature: `val for_all : ('a -> bool) -> 'a option -> bool`
- Doc: Tests if the value in an option satisfies a predicate. Returns [true] if [x] is [None], otherwise returns [p v] where [v] is the contained value. Similar to [List.for_all] but for a single optional value.


`get_or`
- Signature: `val get_or : default:'a -> 'a option -> 'a`
- Doc: Safely extracts the value from an option with a fallback. Returns the value contained in [x] if present, otherwise returns the [default] value. Ensures a value is always returned without risk of exceptions.


`fold`
- Signature: `val fold : ('a -> 'b -> 'a) -> 'a -> 'b option -> 'a`
- Doc: Reduces an optional value using an accumulator. If [x] is [None], returns [acc] unchanged. If [x] is [Some v], returns [f acc v]. Similar to [List.fold_left] but for a single optional value.


`<$>`
- Signature: `val (<$>) : ('a -> 'b) -> 'a option -> 'b option`
- Doc: An infix operator alias for [Option.map f x]. Provides applicative functor syntax for mapping over options.


`monoid_product`
- Signature: `val monoid_product : 'a option -> 'b option -> ('a * 'b) option`
- Doc: Combines two options into a tuple option. Returns [Some (x,y)] if both inputs contain values, [None] if either is [None]. Used for combining independent optional computations.


`let+`
- Signature: `val let+ : 'a option -> ('a -> 'b) -> 'b option`
- Doc: A binding operator alias for [Option.>|=]. Provides syntactic sugar for mapping over options in let-binding syntax.


`and+`
- Signature: `val and+ : 'a option -> 'b option -> ('a * 'b) option`
- Doc: A binding operator alias for [Option.monoid_product]. Provides syntactic sugar for combining options in let-binding syntax.


`let*`
- Signature: `val let* : 'a option -> ('a -> 'b option) -> 'b option`
- Doc: A binding operator alias for [Option.>>=]. Provides monadic let-binding syntax for sequencing optional computations.


`and*`
- Signature: `val and* : 'a option -> 'b option -> ('a * 'b) option`
- Doc: A binding operator alias for [Option.monoid_product]. Alternative syntax for combining options in monadic let-binding style.

