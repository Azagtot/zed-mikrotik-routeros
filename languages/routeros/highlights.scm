(comment) @comment

(control_keyword) @keyword
(variable) @variable

[
  "["
  "]"
] @constant

(string) @attribute

(parameter
  name: (word) @property)

(parameter
  value: (value
    (string) @attribute))

(parameter
  value: (value
    (variable) @variable))

(parameter
  value: (value
    (word) @type))

((statement
  (line_continuation)
  (word) @type))

((word) @constant
  (#match? @constant "^(add|set|remove|print|enable|disable|export|find|edit|get|monitor|reset-counters|move|rename|copy|make-static|setup)$"))

((statement
  (path)
  (word) @property))

((statement
  (path)
  (word) @property
  (word) @property))

((statement
  (path)
  (word) @property
  (word) @property
  (word) @property))

((statement
  (path)
  (word) @property
  (word) @property
  (word) @property
  (word) @property))
