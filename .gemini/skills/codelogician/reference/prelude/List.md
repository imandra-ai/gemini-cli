# Module `List`

47 entries


`append_to_nil`
- Signature: `val append_to_nil : 'a list -> bool`
- Doc: Theorem: (List.append x []) = x


`append_single`
- Signature: `val append_single : 'a -> 'a list -> 'a list -> bool`
- Doc: Theorem: (List.append (List.append y ([x])) z) = (List.append y ((x :: z)))


`len_nonnegative`
- Signature: `val len_nonnegative : 'a list -> bool`
- Doc: Length of a list is non-negative. This useful theorem is installed as a forward-chaining rule.


`len_zero_is_empty`
- Signature: `val len_zero_is_empty : 'a list -> bool`
- Doc: A list has length zero iff it is empty. This is a useful rewrite rule for obtaining empty lists.


`len_append`
- Signature: `val len_append : 'a list -> 'a list -> bool`
- Doc: The length of (x @ y) is the sum of the lengths of x and y


`t`
- Signature: `type 'a t = 'a list`
- Doc: list


`empty`
- Signature: `val empty : 'a list`
- Doc: Returns an empty list


`is_empty`
- Signature: `val is_empty : 'a list -> bool`
- Doc: Tests whether list [l] is empty


`cons`
- Signature: `val cons : 'a -> 'a list -> 'a list`
- Doc: Prepends [x] to the beginning of [l], returning a new list


`return`
- Signature: `val return : 'a -> 'a list`
- Doc: Creates a singleton list containing only [x]


`hd`
- Signature: `val hd : 'a list -> 'a`
- Doc: Returns the first element of list [l]. Partial function that fails on empty lists. But it is recommended to rely on pattern matching instead


`tl`
- Signature: `val tl : 'a list -> 'a list`
- Doc: Returns the list [l] without its first element. Partial function that fails on empty lists. But it is recommended to rely on pattern matching instead


`head_opt`
- Signature: `val head_opt : 'a list -> 'a option`
- Doc: Returns [Some x] where [x] is the first element of [l], or [None] if [l] is empty


`append`
- Signature: `val append : 'a list -> 'a list -> 'a list`
- Doc: Returns a list composed of all elements of [l1], followed by all elements of [l2]


`rev`
- Signature: `val rev : 'a list -> 'a list`
- Doc: Returns a new list with all elements of [l] in reverse order


`length`
- Signature: `val length : 'a list -> int`
- Doc: Returns the number of elements in list [l]. Linear time


`split`
- Signature: `val split : ('a * 'b) list -> 'a list * 'b list`
- Doc: Takes a list of pairs and returns a pair of lists


`map`
- Signature: `val map : ('a -> 'b) -> 'a list -> 'b list`
- Doc: Applies function [f] to each element of [l] and returns the resulting list.


`map2`
- Signature: `val map2 : ('c -> 'a -> 'b) -> 'c list -> 'a list -> ('b list, string) result`
- Doc: Maps function [f] over pairs of elements from [l1] and [l2]. Returns [Error] if lists have different lengths


`for_all`
- Signature: `val for_all : ('a -> bool) -> 'a list -> bool`
- Doc: Tests whether all elements of [l] satisfy predicate [f]


`exists`
- Signature: `val exists : ('a -> bool) -> 'a list -> bool`
- Doc: Tests whether there exists an element in [l] that satisfies predicate [f]


`fold_left`
- Signature: `val fold_left : ('b -> 'a -> 'b) -> 'b -> 'a list -> 'b`
- Doc: Folds list [l] from left to right using function [f] and initial accumulator [acc]


`fold_right`
- Signature: `val fold_right : ('b -> 'a -> 'a) -> 'b list -> 'a -> 'a`
- Doc: Folds list [l] from right to left using function [f] and initial accumulator [acc]


`mapi`
- Signature: `val mapi : (int -> 'b -> 'a) -> 'b list -> 'a list`
- Doc: Maps function [f] over list [l], passing both the element and its index to [f]


`filter`
- Signature: `val filter : ('a -> bool) -> 'a list -> 'a list`
- Doc: Keeps only the elements of [l] that satisfy [f]


`filter_map`
- Signature: `val filter_map : ('a -> 'b option) -> 'a list -> 'b list`
- Doc: Applies [f] to each element of [l]. If [f] returns [Some y], keeps [y] in result list. If [f] returns [None], that element is dropped


`flat_map`
- Signature: `val flat_map : ('b -> 'a list) -> 'b list -> 'a list`
- Doc: Applies [f] to each element of [l] and concatenates all resulting lists


`find`
- Signature: `val find : ('a -> bool) -> 'a list -> 'a option`
- Doc: Returns [Some x] if [x] is the first element of [l] such that [f x] is true. Otherwise it returns [None]


`mem`
- Signature: `val mem : 'a -> 'a list -> bool`
- Doc: Returns [true] iff [x] is an element of [l]


`mem_assoc`
- Signature: `val mem_assoc : 'a -> ('a * 'b) list -> bool`
- Doc: Returns [true] if [x] appears as a key in association list [l]


`nth`
- Signature: `val nth : int -> 'a list -> 'a option`
- Doc: Returns [Some x] where [x] is the nth element of [l], or [None] if list is too short


`assoc`
- Signature: `val assoc : 'a -> ('a * 'b) list -> 'b option`
- Doc: Returns [Some v] if [(x,v)] appears in association list [l], [None] otherwise


`bounded_recons`
- Signature: `val bounded_recons : int -> 'a list -> 'a list`
- Doc: Like [List.take n l], but measured subset is [n] instead of [l]


`take`
- Signature: `val take : int -> 'a list -> 'a list`
- Doc: Returns a list composed of the first (at most) [n] elements of [l]. If [length l <= n] then it returns [l]


`drop`
- Signature: `val drop : int -> 'a list -> 'a list`
- Doc: Returns [l] where the first (at most) [n] elements have been removed. If [length l <= n] then it returns [[]]


`range`
- Signature: `val range : int -> int -> int list`
- Doc: Integer range. [List.range i j] is the list [[i; i+1; i+2; …; j-1]]. Returns the empty list if [i >= j]


`insert_sorted`
- Signature: `val insert_sorted : leq:('a -> 'a -> bool) -> 'a -> 'a list -> 'a list`
- Doc: Inserts [x] in [l], keeping [l] sorted according to [leq]


`sort`
- Signature: `val sort : leq:('a -> 'a -> bool) -> 'a list -> 'a list`
- Doc: Sorts list [l] according to [leq] ordering


`is_sorted`
- Signature: `val is_sorted : leq:('a -> 'a -> bool) -> 'a list -> bool`
- Doc: Checks whether list [l] is sorted according to [leq] ordering


`monoid_product`
- Signature: `val monoid_product : 'a list -> 'b list -> ('a * 'b) list`
- Doc: Returns list of all pairs [(x,y)] where [x] comes from [l1] and [y] from [l2]


`>|=`
- Signature: `val (>|=) : 'a list -> ('a -> 'b) -> 'b list`
- Doc: Infix operator alias for [List.map]


`>>=`
- Signature: `val (>>=) : 'b list -> ('b -> 'a list) -> 'a list`
- Doc: Infix operator alias for [List.flat_map]


`let+`
- Signature: `val let+ : 'b list -> ('b -> 'a) -> 'a list`
- Doc: Alias for [List.>|=]


`and+`
- Signature: `val and+ : 'a list -> 'b list -> ('a * 'b) list`
- Doc: Alias for [List.monoid_product]


`let*`
- Signature: `val let* : 'b list -> ('b -> 'a list) -> 'a list`
- Doc: Alias for [List.>>=]


`and*`
- Signature: `val and* : 'a list -> 'b list -> ('a * 'b) list`
- Doc: Alias for [List.monoid_product]


`--`
- Signature: `val (--) : int -> int -> int list`
- Doc: Infix operator alias for [List.range]
- Note: `end` is not included in the generated list of `(start -- end)`.
- Example: `List.(--) 1 3 (* gives [1;2] *)`

