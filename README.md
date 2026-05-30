# Tree-sitter for Tauraro

A Tree-sitter grammar for the [Tauraro](https://github.com/tauraro/tauraro) programming language.

This repository provides parsing for Tauraro, and features like code navigation, and structural editing in editors like Helix, Neovim, and Emacs.
With highlight, indent and text-object queries.

## Usage with Helix

Helix makes it incredibly easy to use custom Tree-sitter grammars. To add Tauraro support to your local Helix editor, follow these steps:

### 1. Update `languages.toml`

Open your Helix configuration file (usually located at `~/.config/helix/languages.toml` or `~/.config/helix/config.toml` depending on your OS) and add the following configuration:

```toml
[[language]]
name = "tauraro"
scope = "source.tauraro"
injection-regex = "tauraro"
file-types = ["tr", "tau", "tauraro"]
comment-token = "#"
indent = { tab-width = 4, unit = "    " }

[[grammar]]
name = "tauraro"
source = { git = "https://github.com/dev-safe/tree-sitter-tauraro", rev = "main" }
```

### 2. Add the Queries

For Helix to know _how_ to highlight and format the code, it needs the query files.

1. Create a directory for Tauraro queries in your Helix runtime folder:
   ```bash
   mkdir -p ~/.config/helix/runtime/queries/tauraro
   ```
2. Copy the `.scm` files from the `queries/` folder in this repository (`highlights.scm`, `indents.scm`, `locals.scm`, and `textobjects.scm`) into that new directory.
