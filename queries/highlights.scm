; Standard syntax highlighting queries for Tauraro.
; This matches the identifier rules inside the parser and classifies standard builtins.

; --- Keywords & Modifiers ---
[
  "class"
  "aji"
  "def"
  "aiki"
  "interface"
  "enum"
  "struct"
  "tsari"
  "extend"
  "from"
  "import"
  "lambda"
] @keyword

(keyword_modifier) @keyword.modifier

; --- Operators & Punctuation ---
[
  "="
  ":="
  "<-"
  "~>"
  "+"
  "-"
  "*"
  "/"
  "%"
  "//"
  "**"
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "is"
  "in"
  "and"
  "da"
  "or"
  "ko"
  "not"
  "ba"
  "!!"
  "??"
  "=>"
] @operator

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  "."
  ","
  ";"
  ":"
  "->"
] @punctuation.delimiter

; --- Literals ---
(string) @string
(escape_sequence) @string.escape
(number) @number
(constants) @constant.builtin
(self_keyword) @variable.builtin

; --- Identifiers & Names ---
(type_identifier) @type
(builtin_types) @type.builtin

(decorator) @attribute

; --- Function Calls & Declarations ---
(function_definition name: (identifier) @function.method)
(call_expression function: (identifier) @function.call)
(call_expression function: (member_expression property: (identifier) @function.call))

; --- Built-in Functions & Exception Queries ---
; This allows us to highlight standard library entities without hardcoding them in the grammar!
((identifier) @function.builtin
 (#match? @function.builtin "^(print|buga|len|range|input|abs|min|max|sum|round|pow|enumerate|zip|map|filter|sorted|reversed|any|all|chr|ord|hex|bin|oct|isinstance|type|callable|hasattr|getattr|setattr|id|hash|repr|format|iter|next|open|super|vars|dir|eval|exec|assert)$"))

((identifier) @type.builtin
 (#match? @type.builtin "^(Exception|ValueError|TypeError|RuntimeError|IOError|OSError|NameError|KeyError|IndexError|AttributeError|ImportError|MemoryError|RecursionError|NotImplementedError|StopIteration|SystemExit|KeyboardInterrupt|ZeroDivisionError|OverflowError|FileNotFoundError|PermissionError|TimeoutError|ArithmeticError|LookupError)$"))

; Catch-all generic identifier
(identifier) @variable