# Module `Result`

18 entries


`t`
- Signature: `type ('a, 'b) t = ('a, 'b) result`
- Doc: The result type represents either success (Ok) or failure (Error) outcomes.


`return`
- Signature: `val return : 'a -> ('a, 'b) result`
- Doc: wraps a value [x] in an Ok result


`fail`
- Signature: `val fail : 'a -> ('b, 'a) result`
- Doc: wraps a value [s] in an Error result


`map`
- Signature: `val map : ('b -> 'c) -> ('b, 'a) result -> ('c, 'a) result`
- Doc: applies function [f] to the value inside [e] if it's Ok, otherwise propagates the Error


`map_err`
- Signature: `val map_err : ('a -> 'c) -> ('b, 'a) result -> ('b, 'c) result`
- Doc: applies function [f] to the error value if [e] is Error, otherwise propagates the Ok value


`get_or`
- Signature: `val get_or : default:'a -> ('a, 'b) result -> 'a`
- Doc: extracts the Ok value from [e], or returns [default] if [e] is Error


`map_or`
- Signature: `val map_or : default:'a -> ('c -> 'a) -> ('c, 'b) result -> 'a`
- Doc: applies [f] to the Ok value in [e], or returns [default] if [e] is Error


`>|=`
- Signature: `val (>|=) : ('b, 'a) result -> ('b -> 'c) -> ('c, 'a) result`
- Doc: is an infix operator alias for [Result.map]


`flat_map`
- Signature: `val flat_map : ('b -> ('c, 'a) result) -> ('b, 'a) result -> ('c, 'a) result`
- Doc: applies [f] to the Ok value in [e] to produce a new result, or propagates the Error


`>>=`
- Signature: `val (>>=) : ('b, 'a) result -> ('b -> ('c, 'a) result) -> ('c, 'a) result`
- Doc: is an infix operator alias for [Result.flat_map]


`fold`
- Signature: `val fold : ('b -> 'c) -> ('a -> 'c) -> ('b, 'a) result -> 'c`
- Doc: applies [ok] to the value if [x] is Ok, or applies [error] if [x] is Error


`is_ok`
- Signature: `val is_ok : ('a, 'b) result -> bool`
- Doc: returns true if [x] is Ok, false otherwise


`is_error`
- Signature: `val is_error : ('a, 'b) result -> bool`
- Doc: returns true if [x] is Error, false otherwise


`monoid_product`
- Signature: `val monoid_product : ('a, 'b) result -> ('c, 'b) result -> ('a * 'c, 'b) result`
- Doc: combines two results into a tuple if both are Ok, otherwise returns the first Error encountered


`let+`
- Signature: `val let+ : ('c, 'a) result`
- Doc: is a binding operator alias for [>|=] (map)


`and+`
- Signature: `val and+ : (('a * 'c), 'b) result`
- Doc: is a binding operator alias for [Result.monoid_product]


`let*`
- Signature: `val let* : ('c, 'a) result`
- Doc: is a binding operator alias for [>>=] (flat_map)


`and*`
- Signature: `val and* : (('a * 'c), 'b) result`
- Doc: is a binding operator alias for [Result.monoid_product]

