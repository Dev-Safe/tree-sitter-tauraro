; Keywords
(choice "class" "aji" "def" "aiki" "interface" "enum" "struct" "tsari" "extend" "lambda") @keyword.function
(choice "if" "idan" "elif" "koidan" "else" "sai" "for" "ga" "while" "yayinda" "match" "duba" "case" "hali" "try" "gwada" "except" "kama" "finally" "karshe" "with" "return" "dawo" "break" "tsaya" "continue" "ci_gaba" "pass" "wuce" "raise" "jefa" "yield" "bayar" "in" "is" "as") @keyword.control
(choice "import" "from") @keyword.control.import
(choice "async" "marasa_jira" "await" "jira" "spawn" "dan_aiki") @keyword.control.async
(choice "let" "const" "static" "mut" "pub" "abstract" "virtual" "override" "extern" "unsafe") @keyword.storage

; Identifiers
(identifier) @variable
(parameter name: (identifier) @variable.parameter)
(variable_declaration name: (identifier) @variable)
(variable_declaration ["const" "static"] name: (identifier) @constant)

(function_definition name: (identifier) @function)
(class_definition name: (identifier) @type)
(struct_definition name: (identifier) @type)
(interface_definition name: (identifier) @type)
(enum_definition name: (identifier) @type)
(extend_definition name: (identifier) @type)

(member_expression member: (identifier) @variable.other.member)
(call_expression function: (identifier) @function.call)
(call_expression function: (member_expression member: (identifier) @function.method))

; Builtins
(builtin_functions) @function.builtin
(builtin_types) @type.builtin
(builtin_exceptions) @type.builtin
(self) @variable.builtin

; Literals
(number) @constant.numeric
(string) @string
(boolean) @constant.builtin.boolean
(none) @constant.builtin
(escape_sequence) @constant.character.escape

; Punctuation and Operators
(binary_expression operator: _ @operator)
(unary_expression operator: _ @operator)
(assignment_expression operator: _ @operator)
(operators) @operator ; fallback

(punctuation) @punctuation
(colon) @punctuation.delimiter
["(" ")" "[" "]" "{" "}"] @punctuation.bracket
"," @punctuation.delimiter
"." @punctuation.delimiter
"->" @punctuation.delimiter

; Comments
(line_comment) @comment
