; Indent the children of these node types
[
  (block)
  (class_body)
  (enum_body)
  (parameters)
  (type_parameters)
] @indent

; Outdent these specific closing brackets/braces
[
  "}"
  ")"
  "]"
] @outdent
