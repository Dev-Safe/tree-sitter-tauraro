(function_definition name: (identifier) @definition.function)
(class_definition name: (identifier) @definition.class)
(struct_definition name: (identifier) @definition.type)
(interface_definition name: (identifier) @definition.interface)
(enum_definition name: (identifier) @definition.type)

(call_expression function: (identifier) @reference.call)
(call_expression function: (member_expression member: (identifier) @reference.call))
