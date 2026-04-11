[
  (string)
  (raw_string)
  (heredoc_body)
  (heredoc_start)
] @string

(command_name) @function
(variable_name) @variable
(function_definition name: (word) @function)
(file_descriptor) @number
(comment) @comment

[
  "do"
  "else"
  "for"
  "if"
  "while"
  "return"
  "global"
  "local"
  "foreach"
] @keyword

[
  (command_substitution)
  (process_substitution)
  (expansion)
] @embedded

[
  "$"
  "&&"
  ">"
  ">>"
  "<"
  "|"
] @operator

((word) @namespace
  (#match? @namespace "^/"))

((word) @keyword
  (#match? @keyword "^:(if|for|foreach|while|local|global|set|return|delay|do)$"))

((word) @function
  (#match? @function "^:[A-Za-z][A-Za-z0-9-]*$"))

((word) @property
  (#match? @property "^[A-Za-z0-9._-]+=$"))

((word) @variable
  (#match? @variable "^\\$[A-Za-z_][A-Za-z0-9_]*$"))

((word) @constant
  (#match? @constant "^(yes|no|true|false)$"))

((word) @number
  (#match? @number "^[0-9]+(\\.[0-9]+)?([smhdw])?$"))

((word) @keyword
  (#match? @keyword "^(do|if|else|while|for|foreach|return|global|local)$"))

((word) @function
  (#match? @function "^(put|print|log|delay|error|terminal|time|ping|environment|file|interface|ip|system|tool|user|queue|routing|port|ppp|radius|snmp|special-login|store)$"))

((word) @operator
  (#match? @operator "^(and|or|in|not)$"))

((word) @operator
  (#match? @operator "^(=|\\+|-|\\*|/|<|>|<=|>=)$"))
