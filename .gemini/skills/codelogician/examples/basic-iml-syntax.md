Let's see a few educational examples. Each example demonstrates key concepts in IML through:

1. Explanatory comments before functions that highlight important concepts
2. REPL evaluation results showing type signatures and values. Comments marked with (* val ... *) show the REPL's response, helping you understand type inference and evaluation.

These comments are only for educational purposes. They teach you about the thinking process of writing IML code.

Example 1:

```iml
(* Float-like literal is interpreted as type `real`, arbitary precision real number. *)

let pi = 3.14159

(* val pi : real = 314159/100000 *)


(* Arithemetic for real:

- multiplication `*.`

- division `/.`

- etc *)

let circle_area (d : real) : real =

let r = d /. 2.0 in

pi *. r *. r

(* val circle_area : real -> real = <fun> *)
```

Example 2:

```iml
(* Note: `int` is the type for integers. *)
let count_negatives_in_row (row : int list) : int =
    List.fold_left (fun acc num -> if num < 0 then acc + 1 else acc) 0 row
  (* val count_negatives_in_row : int list -> int = <fun> *)

  let x = count_negatives_in_row [-1; -2; -3; 4; 5]
  (* val x : int = 3 *)

  (* Note:
    - `List.nth: int -> 'a list -> 'a option`, NOT returning 'a as in OCaml
    - That's why we need binding operator `let+` and `let*` from `Option` module
   *)
  let count_negative_numbers_in_a_column_wise_row_wise_sorted_matrix
      (m : int list list)
      (n : int)
      (cols : int)
      : int option =
    List.fold_left
      (fun acc i ->
        (* import Option module locally to use `let*`. could also be imported at thebeginning by `open Option` *)
        let open Option in
        let* acc_val = acc in
        let+ row_count = map count_negatives_in_row (List.nth i m) in
        acc_val + row_count)
      (Some 0)
      (0 -- (n - 1))
  (* val count_negative_numbers_in_a_column_wise_row_wise_sorted_matrix :
    int list list -> int -> int -> int option = <fun> *)

```

Example 3:

```iml
(* Note:
- integer division and modulo in IML: `mod: int -> int -> int`. And `/`.
 *)
 let is_divisor (n : int) (divisor : int) : bool =
    n mod divisor = 0
  (* val is_divisor : int -> int -> bool = <fun> *)


  let add_divisors (n : int) (divisor : int) (current_sum : int) : int =
    if divisor = n / divisor then
      current_sum + divisor
    else
      current_sum + divisor + n / divisor
  (* val add_divisors : int -> int -> int -> int = <fun> *)

  let sqrt : real -> real = () [@@opaque]
  (* val sqrt : real -> real = <fun> *)

  (* Note:
  - conversion between `int` and `real`: `Real.of_int` and `Real.to_int`.
   *)
  let sum_of_all_proper_divisors_of_a_natural_number (num : int) : int =
    let calculate_sum_of_divisors (n : int) (limit : int) : int =
      List.fold_left
        (fun acc i ->
          if is_divisor n i then
            acc + add_divisors n i 0
          else
            acc)
        0
        (2 -- limit)
    in
    let limit = Real.to_int (Real.of_int num |> sqrt) in
    calculate_sum_of_divisors num limit + 1
  (* val sum_of_all_proper_divisors_of_a_natural_number : int -> int = <fun> *)

```

Example 4:

```iml
(* Another example with conversion between `real` and `int`. *)
let sum_of_first_n_numbers (n: int) : real =
  (Real.of_int n *. (Real.of_int n +. 1.0)) /. 2.0
(* val sum_of_first_n_numbers : int -> real = <fun> *)

let sum_of_squares_of_first_n_numbers (n: int) : real =
  (Real.of_int n *. (Real.of_int n +. 1.0) *. (2.0 *. Real.of_int n +. 1.0)) /. 6.0

(* val sum_of_squares_of_first_n_numbers : int -> real = <fun> *)


let sum_matrix_element_absolute_difference_row_column_numbers_2 (n: int) : int =
  let sum_first_n = sum_of_first_n_numbers n in
  let sum_squares_n = sum_of_squares_of_first_n_numbers n in
  (sum_first_n +. sum_squares_n) |> Real.to_int
(* val sum_matrix_element_absolute_difference_row_column_numbers_2 : int -> int = <fun> *)

```

Example 5:

```iml
(* Note:
- for opeartions that is unavailable in IML, `[@@opaque]` can be attached
  to a dummy implementation with correct type signature. Such implementation
  can be used to bypass unavailable functions during compilation.
- Example of unavailable operations: bitwise operations (e.g., `land`, `lxor`),
  irrational arithmetic (e.g., square root, exponentiation), random.
 *)
let xor : int -> int -> int = () [@@opaque]
(* val xor : int -> int -> int = <fun> *)

let rec helper state pairs =
  match pairs with
  | [] -> state
  | (a, b) :: rest ->
    let new_state = min state (xor a b) in
    helper new_state rest
(* val helper : int -> (int * int) list -> int = <fun> *)

let find_minimum_xor (arr : int list) : int =
  let initial_state = 999999 in
  let pairs = List.monoid_product arr arr |> List.filter (fun (a, b) -> a < b) in
  helper initial_state pairs
(* val find_minimum_xor : int list -> int = <fun> *)

let minimum_xor_value_pair (arr : int list) : int =
  let sorted_arr = List.sort ~leq:(fun a b -> a <= b) arr in
  find_minimum_xor sorted_arr
(* val minimum_xor_value_pair : int list -> int = <fun> *)

```

Example 6:

```iml
(* Another example using `[@@opaque]` *)
open Option

let random_int : int -> int = () [@@opaque]
(* val random_int : int -> int = <fun> *)

let swap_elements lst i j =
  let get_i = List.nth i lst in
  let get_j = List.nth j lst in
  List.mapi (fun idx x ->
    if idx = i then
      get_j |> get_or ~default:x
    else if idx = j then
      get_i |> get_or ~default:x
    else
      x
  ) lst
(* val swap_elements : 'a list -> int -> int -> 'a list = <fun> *)

let shuffle_a_given_array (arr : int list) : int list =
  let rec helper state i =
    if i <= 0 then
      state
    else
      let j = random_int (i + 1) in
      let state = swap_elements state i j in
      helper state (i - 1)
  in
  helper arr (List.length arr - 1)
(* val shuffle_a_given_array : int list -> int list = <fun> *)

```

Example 7:

```iml
(* Character and String:
- IML supports logic-mode character `LChar.t` and logic-mode string `LString.t`.
- `{l|...|l}` is used to create a logic-mode string, `LString.t`, aka, `LChar.t list`.
- To create a logic-mode character, `LChar.t`, you can use list operations on `LString.t`, eg `List.hd {l|...|l}`.
 *)
let char_0: LChar.t = List.hd {l|0|l}
let char_1: LChar.t = List.hd {l|1|l}
(* val char_0 : LChar.t = '0'
val char_1 : LChar.t = '1' *)

let count_bits (s : LString.t) : int * int =
  let zeros = List.fold_left (fun acc ch -> if ch = char_0 then acc + 1 else acc) 0 s in
  let ones = List.length s - zeros in
  (zeros, ones)
(* val count_bits : LString.t -> int * int = <fun> *)

let change_bits_can_made_one_flip (s : LString.t) : bool =
  let zeros, ones = count_bits s in
  zeros = 1 || ones = 1
(* val change_bits_can_made_one_flip : LString.t -> bool = <fun> *)
```
