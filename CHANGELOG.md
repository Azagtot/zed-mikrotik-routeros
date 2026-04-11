# Changelog

## 0.1.1

- register the bundled `bash` tree-sitter grammar in `extension.toml`
- fix syntax highlighting activation for `.rsc` files in Zed

## 0.1.2

- replace the minimal highlight query with a real `bash`-based highlight query
- add RouterOS-specific highlighting for paths, commands, actions, parameters, and booleans
- ignore locally downloaded `grammars/` artifacts from dev installs

## 0.1.0

- initial Zed extension scaffold for MikroTik RouterOS
- `.rsc` language association
- bundled language server with completions for common RouterOS paths, commands, parameters, and values
- snippets for common RouterOS tasks
- RouterOS `v6` and `v7` specific snippets for BGP, OSPF, wireless, and WireGuard related workflows
- diagnostics for common RouterOS mistakes
