(function_definition) @function.around
(function_definition body: (block) @function.inside)

(class_definition) @class.around
(class_definition body: (block) @class.inside)

(struct_definition) @class.around
(struct_definition body: (block) @class.inside)

(if_statement) @conditional.around
(if_statement consequence: (block) @conditional.inside)

(while_statement) @loop.around
(while_statement body: (block) @loop.inside)

(for_statement) @loop.around
(for_statement body: (block) @loop.inside)

(call_expression arguments: (arguments) @parameter.inside)
(parameters) @parameter.inside
