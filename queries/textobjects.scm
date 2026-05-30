; Select around and inside functions
(function_definition) @function.around
(function_definition (block) @function.inside)

; Select around and inside classes/structs
(class_definition) @class.around
(class_definition (class_body) @class.inside)

(struct_definition) @class.around
(struct_definition (class_body) @class.inside)

(enum_definition) @class.around
(enum_definition (enum_body) @class.inside)

; Select individual parameters inside a signature
(parameter) @parameter.inside
