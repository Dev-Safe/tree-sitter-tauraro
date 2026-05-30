; Define blocks that create new variable scopes
[
  (source_file)
  (block)
  (class_body)
  (enum_body)
] @local.scope

; Definitions (Variables, Functions, Types)
(variable_declaration (identifier) @local.definition.var)
(parameter name: (identifier) @local.definition.var)

(function_definition name: (identifier) @local.definition.function)

(class_definition name: (type_identifier) @local.definition.type)
(struct_definition name: (type_identifier) @local.definition.type)
(interface_definition name: (type_identifier) @local.definition.type)
(enum_definition name: (type_identifier) @local.definition.type)

; References (Any usage of identifiers)
(identifier) @local.reference
(type_identifier) @local.reference
