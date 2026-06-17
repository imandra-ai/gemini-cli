# Module `Map`

8 entries


`t`
- Signature: `type Map.t = {| l : ('a * 'b) list; | default : 'b}`
- Doc: The map type representing a key-value mapping where each key is associated with exactly one value


`const`
- Signature: `val const : 'b -> ('a, 'b) Map.t`
- Doc: Creates a constant map that maps every key to the same value [v]


`add'`
- Signature: `val add' : ('a, 'b) Map.t -> 'a -> 'b -> ('a, 'b) Map.t`
- Doc: Adds or updates the binding from key [k] to value [v] in map [m]


`add`
- Signature: `val add : 'a -> 'b -> ('a, 'b) Map.t -> ('a, 'b) Map.t`
- Doc: Adds or updates the binding from key [k] to value [v] in map [m]


`get_default`
- Signature: `val get_default : ('a, 'b) Map.t -> 'b`
- Doc: Returns the default value associated with map [m]


`get'`
- Signature: `val get' : ('a, 'b) Map.t -> 'a -> 'b`
- Doc: Retrieves the value associated with key [k] in map [m]


`get`
- Signature: `val get : 'a -> ('a, 'b) Map.t -> 'b`
- Doc: Retrieves the value associated with key [k] in map [m]


`of_list`
- Signature: `val of_list : 'b -> ('a * 'b) list -> ('a, 'b) Map.t`
- Doc: Creates a map from a list [l] of key-value pairs, using [default] as the value for keys not in the list

