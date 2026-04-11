# MikroTik RouterOS for Zed

Zed extension for MikroTik RouterOS `.rsc` files.

It currently provides:

- `.rsc` language association as `RouterOS Script`
- basic syntax support for RouterOS scripts
- semantic token highlighting from a bundled language server
- command completion for common RouterOS sections, verbs, parameters, and values
- ready-to-use snippets for firewall, NAT, WireGuard, VLAN, BGP, OSPF, queues, CAPsMAN, scheduler, and other common tasks
- RouterOS `v6` and `v7` snippet variants where syntax differs
- lightweight diagnostics for common RouterOS mistakes

## Install locally

1. Open Zed.
2. Run `zed: extensions`.
3. Choose `Install Dev Extension`.
4. Select the folder `zed-mikrotik-routeros`.

## Recommended Zed settings

For richer RouterOS highlighting in Zed, enable semantic tokens for this language.
This extension provides richer tokenization through its language server, while the
tree-sitter fallback is intentionally basic because RouterOS syntax does not map
cleanly to Bash.

```json
{
  "languages": {
    "RouterOS Script": {
      "semantic_tokens": "full"
    }
  }
}
```

## What completion covers

- Paths like `/ip firewall filter`, `/interface wireguard`, `/routing bgp connection`
- Common verbs like `add`, `set`, `print`, `remove`, `monitor`
- Frequently used parameters like `action=`, `chain=`, `gateway=`, `allowed-address=`
- Common values like firewall actions, protocols, booleans, interface modes, queue kinds
- Scenario snippets like `dual wan failover`, `wireguard site-to-site`, `guest wifi vlan`, `basic home firewall`, `bgp upstream + filters`

## Diagnostics

The bundled language server reports practical warnings for common mistakes, for example:

- NAT actions used outside `/ip/firewall/nat`
- `srcnat` and `dstnat` chains used under `/ip/firewall/filter`
- missing `chain=` or `action=` on firewall rules
- missing `gateway=` on default routes
- missing `allowed-address=` or `public-key=` on WireGuard peers
- mixed RouterOS `v6` and `v7` BGP or OSPF syntax
- unclosed strings and unbalanced script braces

## RouterOS version notes

- `v7` style snippets are included for sections like `/routing/bgp/connection` and `/routing/ospf/interface-template`
- `v6` style snippets are included for sections like `/routing/bgp/peer`, `/routing/ospf/network`, and `/interface/wireless/security-profiles`

## Development

Requirements:

- `node` on `PATH`
- `cargo` and `rustc`

Checks:

```sh
node --check server/routeros_lsp.mjs
cargo check
```

## Project layout

```text
zed-mikrotik-routeros/
├── extension.toml
├── Cargo.toml
├── src/lib.rs
├── server/routeros_lsp.mjs
└── languages/routeros/
```

## License

MIT
