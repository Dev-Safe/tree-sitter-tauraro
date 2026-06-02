; --- Definitions ---
(decorator "@" @punctuation.delimiter)
(decorator (identifier) @attribute)

(class_definition ["class" "aji"] @keyword.function)
(function_definition ["def" "aiki"] @keyword.function)
(function_definition ["async" "marasa_jira"] @keyword.control.async)
(interface_definition "interface" @keyword.function)
(enum_definition "enum" @keyword.function)
(struct_definition ["struct" "tsari"] @keyword.function)
(extend_definition "extend" @keyword.function)

(lambda_expression "lambda" @keyword.function)

; --- Control Flow ---
(if_statement ["if" "idan"] @keyword.control)
(elif_clause ["elif" "koidan"] @keyword.control)
(else_clause ["else" "sai"] @keyword.control)

(for_statement ["for" "ga"] @keyword.control)
(for_statement "in" @keyword.control)

(while_statement ["while" "yayinda"] @keyword.control)

(match_statement ["match" "duba"] @keyword.control)
(case_clause ["case" "hali"] @keyword.control)

(try_statement ["try" "gwada"] @keyword.control)
(except_clause ["except" "kama"] @keyword.control)
(finally_clause ["finally" "karshe"] @keyword.control)

(with_statement "with" @keyword.control)

(unsafe_statement "unsafe" @keyword.control)
(extern_statement "extern" @keyword.control)

(import_statement ["import" "from"] @keyword.control.import)
(import_name "as" @keyword.control.import)

(return_statement ["return" "dawo"] @keyword.control)
(break_statement ["break" "tsaya"] @keyword.control)
(continue_statement ["continue" "ci_gaba"] @keyword.control)
(pass_statement ["pass" "wuce"] @keyword.control)
(raise_statement ["raise" "jefa"] @keyword.control)
(yield_statement ["yield" "bayar"] @keyword.control)

(await_expression ["await" "jira"] @keyword.control.async)
(spawn_expression ["spawn" "dan_aiki"] @keyword.control.async)

; --- Storage & Modifiers ---
(modifier) @keyword.storage
(parameter "mut" @keyword.storage)

; --- Identifiers ---
(identifier) @variable
(parameter name: (identifier) @variable.parameter)
(variable_declaration name: (identifier) @variable)

; Constants: captured when used with const/static or for all-caps identifiers
(variable_declaration (modifier) @keyword.storage name: (identifier) @constant (#match? @keyword.storage "const|static"))
((identifier) @constant (#match? @constant "^[A-Z_][A-Z0-9_]*$"))

(function_definition name: (identifier) @function)
(class_definition name: (identifier) @type)
(struct_definition name: (identifier) @type)
(interface_definition name: (identifier) @type)
(enum_definition name: (identifier) @type)
(extend_definition name: (identifier) @type)

(generic_type name: _ @type)

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

; --- Punctuation and Operators ---
(binary_expression operator: _ @operator)
(binary_expression ["in" "is"] @keyword.control)
(as_expression "as" @keyword.control)
(unary_expression operator: _ @operator)
(assignment_expression operator: _ @operator)

(colon) @punctuation.delimiter
["(" ")" "[" "]" "{" "}"] @punctuation.bracket
"," @punctuation.delimiter
"." @punctuation.delimiter
["->" ":"] @punctuation.delimiter

; --- Comments ---
(line_comment) @comment
