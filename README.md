# mista zozen

### inferred/dynamic variables
- `let`, `var` - they do the same thing, both declare inferred/dynamic variables. <br>
defaults to an 8 bytes `void*`.
- `const` (w/o type) - inferred only. if no value is assigned throws an error.

### Base/primitive Types
- `int` - c integer
- `float` - c float
- `bool` - equiv to c23's `typedef _BitInt(1) bool`.
- `double` - c double
- `short` - c short
- `char` - c char

### Type modifiers
- `unsigned`
- `signed` - default.
- `long`
- `const`
- `lazy`

### Secondary types
- `void()` - function returning void
- `void*` - void pointer
- `int[]` - int array

### literals
- `99` - integer literal
- `"hello, jspp!"` - string literal
- `0o67420` - octal
- `0x7b00ff` - hexadecimal
- TODO: `1_000_000` - underscore readability seperator
- `(Vector2){2.5f, 3.4f}` - struct literal
- `{"name": "ohmyohmy"}` - dynamic object literal