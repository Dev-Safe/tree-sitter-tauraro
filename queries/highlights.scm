(keywords_hausa) @keyword
(keywords_exception) @keyword.control
(keywords_async) @keyword.control
(keywords_control) @keyword.control
(keywords_declaration) @keyword.storage
(keywords_modifier) @keyword.storage
(keywords_operator_word) @keyword.operator

(builtin_exceptions) @type.builtin
(builtin_functions) @function.builtin
(builtin_types) @type.builtin
(constants) @constant.builtin
(self_keyword) @variable.builtin

(string) @string
(escape_sequence) @constant.character.escape
(number) @number
(line_comment) @comment

(operators) @operator
(punctuation) @punctuation

(decorator "@" @punctuation.delimiter)
(decorator (identifier) @attribute)

(class_definition ["class" "aji"] @keyword.storage name: (identifier) @type)
(function_definition ["def" "aiki"] @keyword.storage name: (identifier) @function)
(interface_definition "interface" @keyword.storage name: (identifier) @type)
(enum_definition "enum" @keyword.storage name: (identifier) @type)
(struct_definition ["struct" "tsari"] @keyword.storage name: (identifier) @type)
(extend_definition "extend" @keyword.storage name: (identifier) @type)

(import_statement ["from" "import"] @keyword.control)
(import_statement module: (identifier_dotted) @namespace)

(type_generic type: (identifier) @type "[" @punctuation.bracket)
(method_call "." @punctuation.delimiter method: (identifier) @function.method "(" @punctuation.bracket)
(function_call function: (identifier) @function.call "(" @punctuation.bracket)

(identifier) @variable
