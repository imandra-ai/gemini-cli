---
name: all-prelude-module-signatures
description: Signatures of all modules in IML prelude
---

Now we'll go through the signatures of modules in IML Prelude.

<top-level>
top-level (readily available, no need to quantify with module name)

  val +. : real -> real -> real  (*  [+.] is addition for reals  *)

  type int = <logic_core_builtin>  (*  Builtin integer type, using arbitrary precision integers. This type is an alias to {!Z.t} (using Zarith). NOTE: here Imandra diverges from normal OCaml, where integers width is bounded by native machine integers. "Normal" OCaml integers have type {!Caml.Int.t} and can be entered using the 'i' suffix: [0i]  *)

  type nonrec bool = <logic_core_builtin>  (*  Builtin boolean type.  *)

  val || : bool -> bool -> bool  (*  [||] is the boolean OR operator  *)

  val && : bool -> bool -> bool  (*  [&&] is the boolean AND operator  *)

  type nonrec unit = | ()  (*  Unit type with single constructor [()]  *)

  val = : 'a -> 'a -> bool  (*  Equality. Must be applied to non-function types.  *)

  val <> : 'a -> 'a -> bool  (*  [<>] is the inequality operator  *)

  val not : bool -> bool  (*  [not] is the boolean NOT operator  *)

  val ==> : bool -> bool -> bool  (*  [==>] is logical implication  *)

  val <== : bool -> bool -> bool  (*  [<==] is reverse logical implication  *)

  val <==> : bool -> bool -> bool  (*  [<==>] is logical equivalence  *)

  val + : int -> int -> int  (*  [+] is integer addition  *)

  val const : 'a -> 'b -> 'a  (*  [const x y] returns [x]. In other words, [const x] is the constant function that always returns [x].  *)

  val >= : int -> int -> bool  (*  [>=] is greater than or equal comparison for integers  *)

  val mk_nat : int -> int  (*  [mk_nat x] converts integer [x] to natural number by returning [x] if non-negative, 0 otherwise  *)

  type nonrec option = | None | Some of 'a  (*  Option type representing optional values  *)

  type list = | [] | :: of 'a * 'a list  (*  List type with empty list [] and cons :: constructors  *)

  type nonrec float = <logic_core_builtin>  (*  Floating point number type  *)

  type nonrec real = <logic_core_builtin>  (*  Real number type  *)

  type nonrec string = <logic_core_builtin>  (*  String type  *)

  val < : int -> int -> bool  (*  [<] is less than comparison for integers  *)

  val <= : int -> int -> bool  (*  [<=] is less than or equal comparison for integers  *)

  val > : int -> int -> bool  (*  [>] is greater than comparison for integers  *)

  val min : int -> int -> int  (*  [min x y] returns the minimum of integers [x] and [y]  *)

  val max : int -> int -> int  (*  [max x y] returns the maximum of integers [x] and [y]  *)

  val <. : real -> real -> bool  (*  [<.] is less than comparison for reals  *)

  val <=. : real -> real -> bool  (*  [<=.] is less than or equal comparison for reals  *)

  val >. : real -> real -> bool  (*  [>.] is greater than comparison for reals  *)

  val >=. : real -> real -> bool  (*  [>=.] is greater than or equal comparison for reals  *)

  val min_r : real -> real -> real  (*  [min_r x y] returns the minimum of reals [x] and [y]  *)

  val max_r : real -> real -> real  (*  [max_r x y] returns the maximum of reals [x] and [y]  *)

  val ~- : int -> int  (*  [~- x] returns the negation of integer [x]  *)

  val abs : int -> int  (*  [abs x] returns the absolute value of integer [x]  *)

  val - : int -> int -> int  (*  [-] is integer subtraction  *)

  val ~+ : int -> int  (*  [~+ x] returns [x] unchanged (unary plus)  *)

  val * : int -> int -> int  (*  [*] is integer multiplication  *)

  val / : int -> int -> int  (*  Euclidian division on integers, see http://smtlib.cs.uiowa.edu/theories-Ints.shtml  *)

  val mod : int -> int -> int  (*  Euclidian remainder on integers  *)

  val compare : int -> int -> int  (*  Total order, if x = y then 0 else if x < y then -1 else 1  *)

  type result = | Ok of 'a | Error of 'b  (*  Result type, representing either a successful result [Ok x] or an error [Error x].  *)

  type either = | Left of 'a | Right of 'b  (*  A familiar type for Haskellers  *)

  val |> : 'a -> ('a -> 'b) -> 'b  (*  Pipeline operator. [x |> f] is the same as [f x], but it composes nicely: [ x |> f |> g |> h] can be more readable than [h(g(f x))].  *)

  val @@ : ('a -> 'b) -> 'a -> 'b  (*  Right-associative application operator. [f @@ x] is the same as [f x], but it binds to the right: [f @@ g @@ h @@ x] is the same as [f (g (h x))] but with fewer parentheses.  *)

  val id : 'a -> 'a  (*  Identity function. [id x = x] always holds.  *)

  val %> : ('a -> 'b) -> ('b -> 'c) -> 'a -> 'c  (*  Mathematical composition operator. [f %> g] is [fun x -> g (f x)]  *)

  val -. : real -> real -> real  (*  [-.] is subtraction for reals  *)

  val ~-. : real -> real  (*  [~-.] is negation for reals  *)

  val *. : real -> real -> real  (*  [*.] is multiplication for reals  *)

  val /. : real -> real -> real  (*  [/.] is division for reals  *)

  val @ : 'a list -> 'a list -> 'a list  (*  Infix alias to {!List.append}  *)

  val ^ : String.t -> String.t -> String.t  (*  Alias to {!String.append}  *)

  val succ : int -> int  (*  [succ x] returns the successor of integer [x]  *)

  val pred : int -> int  (*  [pred x] returns the predecessor of integer [x]  *)

  val fst : ('a * 'b) -> 'a  (*  [fst (x,y)] returns the first component [x] of pair [(x,y)]  *)

  val snd : ('a * 'b) -> 'b  (*  [snd (x,y)] returns the second component [y] of pair [(x,y)]  *)

  val -- : int list -> int list -> int list  (*  Alias to {!List.(--)}
- Note: `end` is not included in the generated list of `(start -- end)`.
- Example: `(1--3) (* gives [1;2] *)`  *)

</top-level>


<module_Int>
Module: `Int`
```iml
module type Int = sig
  type t = int
  val mod_zero_prod : int -> int -> int -> bool
  val mod_sub_id : int -> int -> bool
  val (/) : int -> int -> int
  val (mod) : int -> int -> int
  val (<) : int -> int -> bool
  val (+) : int -> int -> int
  val (-) : int -> int -> int
  val (~-) : int -> int
  val (*) : int -> int -> int
  val (<=) : int -> int -> bool
  val (>) : int -> int -> bool
  val (>=) : int -> int -> bool
  val min : int -> int -> int
  val max : int -> int -> int
  val abs : int -> int
  val to_string : int -> string
  val compare : int -> int -> int
  val equal : 'a -> 'a -> bool
  val pow : int -> int -> int
end
```
</module_Int>

<module_List>
Module: `List`
```iml
module type List = sig
  val append_to_nil : 'a list -> bool
  val append_single : 'a -> 'a list -> 'a list -> bool
  val len_nonnegative : 'a list -> bool
  val len_zero_is_empty : 'a list -> bool
  val len_append : 'a list -> 'a list -> bool
  type 'a t = 'a list
  val empty : 'a list
  val is_empty : 'a list -> bool
  val cons : 'a -> 'a list -> 'a list
  val return : 'a -> 'a list
  val hd : 'a list -> 'a
  val tl : 'a list -> 'a list
  val head_opt : 'a list -> 'a option
  val append : 'a list -> 'a list -> 'a list
  val rev : 'a list -> 'a list
  val length : 'a list -> int
  val split : ('a * 'b) list -> 'a list * 'b list
  val map : ('a -> 'b) -> 'a list -> 'b list
  val map2 : ('c -> 'a -> 'b) -> 'c list -> 'a list -> ('b list, string) result
  val for_all : ('a -> bool) -> 'a list -> bool
  val exists : ('a -> bool) -> 'a list -> bool
  val fold_left : ('b -> 'a -> 'b) -> 'b -> 'a list -> 'b
  val fold_right : ('b -> 'a -> 'a) -> 'b list -> 'a -> 'a
  val mapi : (int -> 'b -> 'a) -> 'b list -> 'a list
  val filter : ('a -> bool) -> 'a list -> 'a list
  val filter_map : ('a -> 'b option) -> 'a list -> 'b list
  val flat_map : ('b -> 'a list) -> 'b list -> 'a list
  val find : ('a -> bool) -> 'a list -> 'a option
  val mem : 'a -> 'a list -> bool
  val mem_assoc : 'a -> ('a * 'b) list -> bool
  val nth : int -> 'a list -> 'a option
  val assoc : 'a -> ('a * 'b) list -> 'b option
  val bounded_recons : int -> 'a list -> 'a list
  val take : int -> 'a list -> 'a list
  val drop : int -> 'a list -> 'a list
  val range : int -> int -> int list
  val insert_sorted : leq:('a -> 'a -> bool) -> 'a -> 'a list -> 'a list
  val sort : leq:('a -> 'a -> bool) -> 'a list -> 'a list
  val is_sorted : leq:('a -> 'a -> bool) -> 'a list -> bool
  val monoid_product : 'a list -> 'b list -> ('a * 'b) list
  val (>|=) : 'a list -> ('a -> 'b) -> 'b list
  val (>>=) : 'b list -> ('b -> 'a list) -> 'a list
  val let+ : 'b list -> ('b -> 'a) -> 'a list
  val and+ : 'a list -> 'b list -> ('a * 'b) list
  val let* : 'b list -> ('b -> 'a list) -> 'a list
  val and* : 'a list -> 'b list -> ('a * 'b) list
  val (--) : int -> int -> int list
end
```
</module_List>

<module_Set>
Module: `Set`
```iml
module type Set = sig
  type Set.t = ('a, bool) Map.t
  val empty : ('a, bool) Map.t
  val full : ('a, bool) Map.t
  val is_empty : 'a Set.t -> bool
  val is_valid : 'a Set.t -> bool
  val mem : 'a -> 'a Set.t -> bool
  val subset : 'a Set.t -> 'a Set.t -> bool
  val add : 'a -> 'a Set.t -> 'a Set.t
  val remove : 'a -> 'a Set.t -> 'a Set.t
  val inter : 'a Set.t -> 'a Set.t -> 'a Set.t
  val union : 'a Set.t -> 'a Set.t -> 'a Set.t
  val complement : 'a Set.t -> 'a Set.t
  val diff : 'a Set.t -> 'a Set.t -> 'a Set.t
  val of_list : 'a list -> ('a, bool) Map.t
  val (++) : 'a Set.t -> 'a Set.t -> 'a Set.t
  val (--) : 'a Set.t -> 'a Set.t -> 'a Set.t
end
```
</module_Set>

<module_Result>
Module: `Result`
```iml
module type Result = sig
  type ('a, 'b) t = ('a, 'b) result
  val return : 'a -> ('a, 'b) result
  val fail : 'a -> ('b, 'a) result
  val map : ('b -> 'c) -> ('b, 'a) result -> ('c, 'a) result
  val map_err : ('a -> 'c) -> ('b, 'a) result -> ('b, 'c) result
  val get_or : default:'a -> ('a, 'b) result -> 'a
  val map_or : default:'a -> ('c -> 'a) -> ('c, 'b) result -> 'a
  val (>|=) : ('b, 'a) result -> ('b -> 'c) -> ('c, 'a) result
  val flat_map : ('b -> ('c, 'a) result) -> ('b, 'a) result -> ('c, 'a) result
  val (>>=) : ('b, 'a) result -> ('b -> ('c, 'a) result) -> ('c, 'a) result
  val fold : ('b -> 'c) -> ('a -> 'c) -> ('b, 'a) result -> 'c
  val is_ok : ('a, 'b) result -> bool
  val is_error : ('a, 'b) result -> bool
  val monoid_product : ('a, 'b) result -> ('c, 'b) result -> ('a * 'c, 'b) result
  val let+ : ('c, 'a) result
  val and+ : (('a * 'c), 'b) result
  val let* : ('c, 'a) result
  val and* : (('a * 'c), 'b) result
end
```
</module_Result>

<module_Real>
Module: `Real`
```iml
module type Real = sig
  type t = real
  val of_int : int -> real
  val _to_int_round_down : real -> int
  val to_int : real -> int
  val (+) : real -> real -> real
  val (-) : real -> real -> real
  val (~-) : real -> real
  val (*) : real -> real -> real
  val (/) : real -> real -> real
  val (<) : real -> real -> bool
  val (<=) : real -> real -> bool
  val (>) : real -> real -> bool
  val (>=) : real -> real -> bool
  val abs : real -> real
  val min : real -> real -> real
  val max : real -> real -> real
  val of_float : float -> real
  val pow : real -> int -> real
end
```
</module_Real>

<module_String>
Module: `String`
```iml
module type String = sig
  type String.t = string
  val empty : string
  val length : String.t -> int
  val append : String.t -> String.t -> String.t
  val concat : string -> String.t list -> string
  val prefix : String.t -> String.t -> bool
  val suffix : String.t -> String.t -> bool
  val contains : String.t -> String.t -> bool
  val unsafe_sub : String.t -> int -> int -> String.t
  val sub : string -> int -> int -> String.t option
  val of_int : int -> string
  val unsafe_to_nat : String.t -> int
  val to_nat : string -> int option
  val is_nat : string -> bool
  val is_int : string -> bool
  val unsafe_to_int : string -> int
  val to_int : string -> int option
end
```
</module_String>

<module_Option>
Module: `Option`
```iml
module type Option = sig
  type 'a t = 'a option
  val map : ('a -> 'b) -> 'a option -> 'b option
  val map_or : default:'a -> ('b -> 'a) -> 'b option -> 'a
  val is_some : 'a option -> bool
  val is_none : 'a option -> bool
  val return : 'a -> 'a option
  val (>|=) : 'a option -> ('a -> 'b) -> 'b option
  val flat_map : ('a -> 'b option) -> 'a option -> 'b option
  val (>>=) : 'a option -> ('a -> 'b option) -> 'b option
  val or_ : 'a option -> 'a option -> 'a option
  val (<+>) : 'a option -> 'a option -> 'a option
  val exists : ('a -> bool) -> 'a option -> bool
  val for_all : ('a -> bool) -> 'a option -> bool
  val get_or : default:'a -> 'a option -> 'a
  val fold : ('a -> 'b -> 'a) -> 'a -> 'b option -> 'a
  val (<$>) : ('a -> 'b) -> 'a option -> 'b option
  val monoid_product : 'a option -> 'b option -> ('a * 'b) option
  val let+ : 'a option -> ('a -> 'b) -> 'b option
  val and+ : 'a option -> 'b option -> ('a * 'b) option
  val let* : 'a option -> ('a -> 'b option) -> 'b option
  val and* : 'a option -> 'b option -> ('a * 'b) option
end
```
</module_Option>

<module_LChar>
Module: `LChar`
```iml
module type LChar = sig
  type LChar.t =
LChar.Char of bool * bool * bool * bool * bool * bool * bool * bool
  val zero : LChar.t
  val is_printable : LChar.t -> bool
end
```
</module_LChar>

<module_Multiset>
Module: `Multiset`
```iml
module type Multiset = sig
  type Multiset.t = ('a, int) Map.t
  val empty : ('a, int) Map.t
  val add : 'a -> ('a, int) Map.t -> ('a, int) Map.t
  val find : 'a -> ('a, int) Map.t -> int
  val mem : 'a -> ('a, int) Map.t -> bool
  val remove : 'a -> ('a, int) Map.t -> ('a, int) Map.t
  val of_list : 'a list -> ('a, int) Map.t
end
```
</module_Multiset>

<module_Map>
Module: `Map`
```iml
module type Map = sig
  type Map.t = {| l : ('a * 'b) list; | default : 'b}
  val const : 'b -> ('a, 'b) Map.t
  val add' : ('a, 'b) Map.t -> 'a -> 'b -> ('a, 'b) Map.t
  val add : 'a -> 'b -> ('a, 'b) Map.t -> ('a, 'b) Map.t
  val get_default : ('a, 'b) Map.t -> 'b
  val get' : ('a, 'b) Map.t -> 'a -> 'b
  val get : 'a -> ('a, 'b) Map.t -> 'b
  val of_list : 'b -> ('a * 'b) list -> ('a, 'b) Map.t
end
```
</module_Map>

<module_LString>
Module: `LString`
```iml
module type LString = sig
  type t = LChar.t list
  val empty : LChar.t list
  val of_list : 'a -> 'a
  val length : LChar.t list -> int
  val append : LChar.t list -> LChar.t list -> LChar.t list
  val (^^) : LChar.t list -> LChar.t list -> LChar.t list
  val for_all : (LChar.t -> bool) -> LChar.t list -> bool
  val exists : (LChar.t -> bool) -> LChar.t list -> bool
  val concat : LChar.t list -> LChar.t list list -> LChar.t list
  val is_printable : LChar.t list -> bool
  val sub : LChar.t list -> int -> int -> LChar.t list
  val prefix : LChar.t list -> LChar.t list -> bool
  val suffix : LChar.t list -> LChar.t list -> bool
  val contains : LChar.t list -> LChar.t list -> bool
  val take : int -> LString.t -> LString.t
  val drop : int -> LString.t -> LString.t
  val len_pos : LChar.t list -> bool
  val len_zero_inversion : LChar.t list -> bool
end
```
</module_LString>

