# Tree-sitter for Tauraro

A Tree-sitter grammar for the [Tauraro](https://github.com/tauraro-lang) programming language.

This repository provides fast, robust parsing for Tauraro, enabling advanced features like precise syntax highlighting, code navigation, and structural editing in editors like Helix, Neovim, and Emacs.

## Usage with Helix

Helix makes it incredibly easy to use custom Tree-sitter grammars. To add Tauraro support to your local Helix editor, follow these steps:

### 1. Update `languages.toml`

Open your Helix configuration file (usually located at `~/.config/helix/languages.toml` or `~/.config/helix/config.toml` depending on your OS) and add the following configuration:

```toml
[[language]]
name = "tauraro"
scope = "source.tauraro"
injection-regex = "tauraro"
file-types = ["tau"]
comment-token = "#"
indent = { tab-width = 4, unit = "    " }

[[grammar]]
name = "tauraro"
source = { git = "https://github.com/ken-morel/tree-sitter-tauraro", rev = "main" }
```

### 2. Add the Queries

For Helix to know _how_ to highlight and format the code, it needs the query files.

1. Create a directory for Tauraro queries in your Helix runtime folder:
   ```bash
   mkdir -p ~/.config/helix/runtime/queries/tauraro
   ```
2. Copy the `.scm` files from the `queries/` folder in this repository (`highlights.scm`, `indents.scm`, `locals.scm`, and `textobjects.scm`) into that new directory.

### 3. Fetch and Build

Finally, tell Helix to download and compile the grammar:

```bash
hx --grammar fetch
hx --grammar build
```

You are all set! Open a `.tau` file in Helix to see your new syntax highlighting and text objects in action.

## Developing Locally

If you want to contribute to the grammar or test changes locally, you will need [Node.js](https://nodejs.org/) and a C compiler installed.

1. Clone the repository:
   ```bash
   git clone [https://github.com/ken-morel/tree-sitter-tauraro.git](https://github.com/ken-morel/tree-sitter-tauraro.git)
   cd tree-sitter-tauraro
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate the parser (run this every time you modify `grammar.js`):
   ```bash
   npx tree-sitter generate
   ```
4. Run tests:
   ```bash
   npx tree-sitter test
   ```

## License

MIT
