# Top-Level

57 entries

The following entries are directly available in IML without qualification.


`+.`
- Signature: `val +. : real -> real -> real`
- Doc: [+.] is addition for reals


`int`
- Signature: `type int = <logic_core_builtin>`
- Doc: Builtin integer type, using arbitrary precision integers. This type is an alias to {!Z.t} (using Zarith). NOTE: here Imandra diverges from normal OCaml, where integers width is bounded by native machine integers. "Normal" OCaml integers have type {!Caml.Int.t} and can be entered using the 'i' suffix: [0i]


`bool`
- Signature: `type nonrec bool = <logic_core_builtin>`
- Doc: Builtin boolean type.


`||`
- Signature: `val || : bool -> bool -> bool`
- Doc: [||] is the boolean OR operator


`&&`
- Signature: `val && : bool -> bool -> bool`
- Doc: [&&] is the boolean AND operator


`unit`
- Signature: `type nonrec unit = | ()`
- Doc: Unit type with single constructor [()]


`=`
- Signature: `val = : 'a -> 'a -> bool`
- Doc: Equality. Must be applied to non-function types.


`<>`
- Signature: `val <> : 'a -> 'a -> bool`
- Doc: [<>] is the inequality operator


`not`
- Signature: `val not : bool -> bool`
- Doc: [not] is the boolean NOT operator


`==>`
- Signature: `val ==> : bool -> bool -> bool`
- Doc: [==>] is logical implication


`<==`
- Signature: `val <== : bool -> bool -> bool`
- Doc: [<==] is reverse logical implication


`<==>`
- Signature: `val <==> : bool -> bool -> bool`
- Doc: [<==>] is logical equivalence


`+`
- Signature: `val + : int -> int -> int`
- Doc: [+] is integer addition


`const`
- Signature: `val const : 'a -> 'b -> 'a`
- Doc: [const x y] returns [x]. In other words, [const x] is the constant function that always returns [x].


`>=`
- Signature: `val >= : int -> int -> bool`
- Doc: [>=] is greater than or equal comparison for integers


`mk_nat`
- Signature: `val mk_nat : int -> int`
- Doc: [mk_nat x] converts integer [x] to natural number by returning [x] if non-negative, 0 otherwise


`option`
- Signature: `type nonrec option = | None | Some of 'a`
- Doc: Option type representing optional values


`list`
- Signature: `type list = | [] | :: of 'a * 'a list`
- Doc: List type with empty list [] and cons :: constructors


`float`
- Signature: `type nonrec float = <logic_core_builtin>`
- Doc: Floating point number type


`real`
- Signature: `type nonrec real = <logic_core_builtin>`
- Doc: Real number type


`string`
- Signature: `type nonrec string = <logic_core_builtin>`
- Doc: String type


`<`
- Signature: `val < : int -> int -> bool`
- Doc: [<] is less than comparison for integers


`<=`
- Signature: `val <= : int -> int -> bool`
- Doc: [<=] is less than or equal comparison for integers


`>`
- Signature: `val > : int -> int -> bool`
- Doc: [>] is greater than comparison for integers


`min`
- Signature: `val min : int -> int -> int`
- Doc: [min x y] returns the minimum of integers [x] and [y]


`max`
- Signature: `val max : int -> int -> int`
- Doc: [max x y] returns the maximum of integers [x] and [y]


`<.`
- Signature: `val <. : real -> real -> bool`
- Doc: [<.] is less than comparison for reals


`<=.`
- Signature: `val <=. : real -> real -> bool`
- Doc: [<=.] is less than or equal comparison for reals


`>.`
- Signature: `val >. : real -> real -> bool`
- Doc: [>.] is greater than comparison for reals


`>=.`
- Signature: `val >=. : real -> real -> bool`
- Doc: [>=.] is greater than or equal comparison for reals


`min_r`
- Signature: `val min_r : real -> real -> real`
- Doc: [min_r x y] returns the minimum of reals [x] and [y]


`max_r`
- Signature: `val max_r : real -> real -> real`
- Doc: [max_r x y] returns the maximum of reals [x] and [y]


`~-`
- Signature: `val ~- : int -> int`
- Doc: [~- x] returns the negation of integer [x]


`abs`
- Signature: `val abs : int -> int`
- Doc: [abs x] returns the absolute value of integer [x]


`-`
- Signature: `val - : int -> int -> int`
- Doc: [-] is integer subtraction


`~+`
- Signature: `val ~+ : int -> int`
- Doc: [~+ x] returns [x] unchanged (unary plus)


`*`
- Signature: `val * : int -> int -> int`
- Doc: [*] is integer multiplication


`/`
- Signature: `val / : int -> int -> int`
- Doc: Euclidian division on integers, see http://smtlib.cs.uiowa.edu/theories-Ints.shtml


`mod`
- Signature: `val mod : int -> int -> int`
- Doc: Euclidian remainder on integers


`compare`
- Signature: `val compare : int -> int -> int`
- Doc: Total order, if x = y then 0 else if x < y then -1 else 1


`result`
- Signature: `type result = | Ok of 'a | Error of 'b`
- Doc: Result type, representing either a successful result [Ok x] or an error [Error x].


`either`
- Signature: `type either = | Left of 'a | Right of 'b`
- Doc: A familiar type for Haskellers


`|>`
- Signature: `val |> : 'a -> ('a -> 'b) -> 'b`
- Doc: Pipeline operator. [x |> f] is the same as [f x], but it composes nicely: [ x |> f |> g |> h] can be more readable than [h(g(f x))].


`@@`
- Signature: `val @@ : ('a -> 'b) -> 'a -> 'b`
- Doc: Right-associative application operator. [f @@ x] is the same as [f x], but it binds to the right: [f @@ g @@ h @@ x] is the same as [f (g (h x))] but with fewer parentheses.


`id`
- Signature: `val id : 'a -> 'a`
- Doc: Identity function. [id x = x] always holds.


`%>`
- Signature: `val %> : ('a -> 'b) -> ('b -> 'c) -> 'a -> 'c`
- Doc: Mathematical composition operator. [f %> g] is [fun x -> g (f x)]


`-.`
- Signature: `val -. : real -> real -> real`
- Doc: [-.] is subtraction for reals


`~-.`
- Signature: `val ~-. : real -> real`
- Doc: [~-.] is negation for reals


`*.`
- Signature: `val *. : real -> real -> real`
- Doc: [*.] is multiplication for reals


`/.`
- Signature: `val /. : real -> real -> real`
- Doc: [/.] is division for reals


`@`
- Signature: `val @ : 'a list -> 'a list -> 'a list`
- Doc: Infix alias to {!List.append}


`^`
- Signature: `val ^ : String.t -> String.t -> String.t`
- Doc: Alias to {!String.append}


`succ`
- Signature: `val succ : int -> int`
- Doc: [succ x] returns the successor of integer [x]


`pred`
- Signature: `val pred : int -> int`
- Doc: [pred x] returns the predecessor of integer [x]


`fst`
- Signature: `val fst : ('a * 'b) -> 'a`
- Doc: [fst (x,y)] returns the first component [x] of pair [(x,y)]


`snd`
- Signature: `val snd : ('a * 'b) -> 'b`
- Doc: [snd (x,y)] returns the second component [y] of pair [(x,y)]


`--`
- Signature: `val -- : int list -> int list -> int list`
- Doc: Alias to {!List.(--)}
- Note: `end` is not included in the generated list of `(start -- end)`.
- Example: `(1--3) (* gives [1;2] *)`

