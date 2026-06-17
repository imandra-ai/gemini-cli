# Module `LChar`

3 entries


`t`
- Signature: `type LChar.t =
LChar.Char of bool * bool * bool * bool * bool * bool * bool * bool`
- Doc: An 8-bit character


`zero`
- Signature: `val zero : LChar.t`
- Doc: Returns a character with all bits set to false (null character)


`is_printable`
- Signature: `val is_printable : LChar.t -> bool`
- Doc: Tests if character [c] is printable based on its bit pattern

