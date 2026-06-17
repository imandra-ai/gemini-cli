# Module `Set`

16 entries


`t`
- Signature: `type Set.t = ('a, bool) Map.t`
- Doc: The set type, implemented as a map from elements to boolean values indicating membership


`empty`
- Signature: `val empty : ('a, bool) Map.t`
- Doc: Creates an empty set where all elements are mapped to false


`full`
- Signature: `val full : ('a, bool) Map.t`
- Doc: Creates a full set where all elements are mapped to true


`is_empty`
- Signature: `val is_empty : 'a Set.t -> bool`
- Doc: Tests if set [s] is empty by comparing it to the empty set


`is_valid`
- Signature: `val is_valid : 'a Set.t -> bool`
- Doc: Checks if set [s] is valid. Always returns true since all sets are valid


`mem`
- Signature: `val mem : 'a -> 'a Set.t -> bool`
- Doc: Tests if element [x] is a member of set [s]


`subset`
- Signature: `val subset : 'a Set.t -> 'a Set.t -> bool`
- Doc: Tests if set [s1] is a subset of set [s2]


`add`
- Signature: `val add : 'a -> 'a Set.t -> 'a Set.t`
- Doc: Adds element [x] to set [s]


`remove`
- Signature: `val remove : 'a -> 'a Set.t -> 'a Set.t`
- Doc: Removes element [x] from set [s]


`inter`
- Signature: `val inter : 'a Set.t -> 'a Set.t -> 'a Set.t`
- Doc: Computes the intersection of sets [s1] and [s2]


`union`
- Signature: `val union : 'a Set.t -> 'a Set.t -> 'a Set.t`
- Doc: Computes the union of sets [s1] and [s2]


`complement`
- Signature: `val complement : 'a Set.t -> 'a Set.t`
- Doc: Computes the complement of set [s]


`diff`
- Signature: `val diff : 'a Set.t -> 'a Set.t -> 'a Set.t`
- Doc: Computes the difference of sets [s1] and [s2]


`of_list`
- Signature: `val of_list : 'a list -> ('a, bool) Map.t`
- Doc: Creates a set from list [l] by recursively adding each element


`++`
- Signature: `val (++) : 'a Set.t -> 'a Set.t -> 'a Set.t`
- Doc: An infix operator alias for [Set.union]


`--`
- Signature: `val (--) : 'a Set.t -> 'a Set.t -> 'a Set.t`
- Doc: An infix operator alias for [Set.diff]

