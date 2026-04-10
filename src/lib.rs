use zed_extension_api::{self as zed, Result};

struct MikroTikRouterOsExtension;

impl zed::Extension for MikroTikRouterOsExtension {
    fn new() -> Self {
        Self
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &zed::LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        let node = worktree
            .which("node")
            .ok_or_else(|| "Node.js is required to run RouterOS completions".to_string())?;

        Ok(zed::Command {
            command: node,
            args: vec!["server/routeros_lsp.mjs".to_string()],
            env: worktree.shell_env(),
        })
    }
}

zed::register_extension!(MikroTikRouterOsExtension);
