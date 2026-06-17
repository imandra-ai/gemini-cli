# Module `Multiset`

7 entries


`t`
- Signature: `type Multiset.t = ('a, int) Map.t`
- Doc: The multiset type, implemented as a map from elements to their occurrence counts. Each element is associated with an integer representing how many times it appears in the multiset.


`empty`
- Signature: `val empty : ('a, int) Map.t`
- Doc: Creates an empty multiset where all possible elements implicitly have a count of 0. This serves as the starting point for building multisets.


`add`
- Signature: `val add : 'a -> ('a, int) Map.t -> ('a, int) Map.t`
- Doc: Adds one occurrence of element [x] to multiset [m] by retrieving its current count, incrementing it by 1, and storing the new count. This maintains the multiset property of tracking multiple occurrences.


`find`
- Signature: `val find : 'a -> ('a, int) Map.t -> int`
- Doc: Retrieves the number of occurrences of element [x] in multiset [m]. This is an alias for Map.get that returns the count directly.


`mem`
- Signature: `val mem : 'a -> ('a, int) Map.t -> bool`
- Doc: Tests if element [x] exists in multiset [m] by checking if its occurrence count is greater than 0. This distinguishes between elements that are present (count > 0) and absent (count = 0).


`remove`
- Signature: `val remove : 'a -> ('a, int) Map.t -> ('a, int) Map.t`
- Doc: Removes one occurrence of element [x] from multiset [m] by decreasing its count by 1, ensuring the count never goes below 0. This maintains the invariant that counts are always non-negative.


`of_list`
- Signature: `val of_list : 'a list -> ('a, int) Map.t`
- Doc: Converts a list [l] into a multiset by recursively processing each element. It starts with an empty multiset and adds each element from the list in sequence, building up the occurrence counts.

