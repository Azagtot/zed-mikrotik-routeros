# Changelog

## 0.1.12

- normalize published git history to a GitHub-linked noreply identity
- publish a clean follow-up release so Zed catalog validation sees a single contributor identity

## 0.1.10

- disable semantic token coloring from the RouterOS language server
- keep completion, diagnostics, hover, and go to definition in the LSP
- rely on Zed tree-sitter highlighting only, which gives a more stable and VS Code-like visual result

## 0.1.9

- tune RouterOS token classification toward the reference VS Code screenshot
- keep root path commands like `/interface` and `/caps-man` visually neutral
- color path subcommands and parameter names separately from their values
- make `add` and `set` style verbs stand out as command keywords

## 0.1.8

- simplify semantic token coloring to better match the VS Code RouterOS grammar
- stop semantically over-highlighting paths, parameter names, and command verbs in Zed
- keep Zed syntax highlighting stable while making full semantic coloring visually closer to VS Code

## 0.1.7

- restore the last known working tree-sitter highlight query for Zed syntax coloring
- fix a regression where the VS Code style highlight alignment reduced or broke syntax highlighting in Zed
- keep hover, go to definition, snippets, and semantic token improvements from recent releases

## 0.1.6

- add go to definition for `:global ... do=` functions and `$name` symbol references in the current file
- add hover documentation from leading `#` comments above global function definitions
- add hover for simple string-valued `:global` and `:local` declarations

## 0.1.5

- align fallback syntax highlighting more closely with the VS Code RouterOS extension
- add VS Code style snippets for `gfunc`, `if`, `foreach`, and `try`
- add completion for global symbols after `$` and command-style completion after `:`

## 0.1.4

- fix semantic token ordering so Zed can deserialize RouterOS highlighting correctly
- prevent invalid negative semantic token deltas from breaking rich syntax highlighting

## 0.1.1

- register the bundled `bash` tree-sitter grammar in `extension.toml`
- fix syntax highlighting activation for `.rsc` files in Zed

## 0.1.2

- replace the minimal highlight query with a real `bash`-based highlight query
- add RouterOS-specific highlighting for paths, commands, actions, parameters, and booleans
- ignore locally downloaded `grammars/` artifacts from dev installs

## 0.1.3

- embed the bundled RouterOS language server into the Rust extension
- fix Zed launching the language server relative to the opened project instead of the extension directory
- restore semantic highlighting, completions, and diagnostics for `.rsc` files

## 0.1.0

- initial Zed extension scaffold for MikroTik RouterOS
- `.rsc` language association
- bundled language server with completions for common RouterOS paths, commands, parameters, and values
- snippets for common RouterOS tasks
- RouterOS `v6` and `v7` specific snippets for BGP, OSPF, wireless, and WireGuard related workflows
- diagnostics for common RouterOS mistakes
