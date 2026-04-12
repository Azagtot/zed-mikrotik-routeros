[
  (string)
  (raw_string)
  (heredoc_body)
  (heredoc_start)
] @string

(variable_name) @property
(function_definition name: (word) @function)
(file_descriptor) @number
(comment) @comment

[
  "case"
  "do"
  "done"
  "elif"
  "else"
  "esac"
  "export"
  "fi"
  "for"
  "function"
  "if"
  "in"
  "select"
  "then"
  "unset"
  "until"
  "while"
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

(
  (command (_) @constant)
  (#match? @constant "^-")
)

((word) @keyword
  (#match? @keyword "^:"))

((word) @property
  (#match? @property "^[A-Za-z0-9._-]+=$"))

((word) @constant
  (#match? @constant "^(yes|no|true|false)$"))

((word) @number
  (#match? @number "^[0-9]+([smhdw]|\\.[0-9]+)?$"))

((word) @type
  (#match? @type "^(input|output|forward|prerouting|postrouting|srcnat|dstnat)$"))

((word) @keyword
  (#match? @keyword "^(accept|drop|reject|log|fasttrack-connection|jump|return|passthrough|mark-routing|mark-connection|mark-packet|src-nat|masquerade|dst-nat|netmap|redirect|same|notrack)$"))

((word) @keyword
  (#match? @keyword "^(add|set|remove|print|enable|disable|export|find|edit|get|monitor|reset-counters|move|rename|copy|make-static|setup)$"))
