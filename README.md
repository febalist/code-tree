# code-tree

[![npm version](https://img.shields.io/npm/v/@febalist/code-tree)](https://www.npmjs.com/package/@febalist/code-tree)
[![CI](https://github.com/febalist/code-tree/actions/workflows/ci.yml/badge.svg)](https://github.com/febalist/code-tree/actions/workflows/ci.yml)

A CLI tool and MCP server for quickly exploring project structure and codebase.

**Requirements:** Bun

## Features

- 🌳 Directory structure scanning (like `tree`)
- 🔍 Code symbol extraction: classes, functions, interfaces, types
- 📝 Doc comment support
- 🚀 Accurate AST parsing via Tree-sitter (WASM)
- 🎯 10+ programming languages + Markdown
- ⚡ Automatic output optimization

## Installation

```bash
# Global installation
bun add -g @febalist/code-tree

# Or use with bunx (no installation needed)
bunx @febalist/code-tree .
```

## Usage

```bash
# Scan current directory
code-tree .

# Scan specific directory
code-tree src/

# Parse specific file
code-tree src/index.ts

# Multiple paths
code-tree src/ lib/

# With options
code-tree --depth 2 --no-symbols .
code-tree --ignore "*.test.ts" --ignore "*.spec.ts" src/

# Help
code-tree --help
```

## Parameters

- **Positional arguments**: Paths to directories or files (default: `.`)
- `--depth <n>`: Maximum traversal depth (default: 10)
- `--symbols` / `--no-symbols`: Include/exclude code symbols (default: auto)
- `--comments` / `--no-comments`: Include/exclude doc comments (default: auto)
- `--ignore <pattern>`: Additional ignore patterns (repeatable)

## Output Examples

**Directory with symbols:**
```
src/
├── index.ts
│     async run(args)
├── parser/
│   ├── index.ts
│   │     class ParserManager
│   │       async init()
│   │       private async loadLanguage(config: LanguageConfig): Promise<Language>
│   │       async parseFile(filePath: string): Promise<FileSymbols | null>
│   └── types.ts
│         type SymbolKind
│         interface CodeSymbol
│         interface FileSymbols
```

**File with detailed breakdown:**
```
src/parser/index.ts

  class ParserManager
    async init()
      locateFile()
    private async loadLanguage(config: LanguageConfig): Promise<Language>
    async parseFile(filePath: string): Promise<FileSymbols | null>
```

## Supported Languages

- TypeScript (.ts, .tsx)
- JavaScript (.js, .jsx, .mjs, .cjs)
- Python (.py, .pyw)
- Go (.go)
- PHP (.php)
- Rust (.rs)
- Java (.java)
- C# (.cs)
- Ruby (.rb)
- Kotlin (.kt, .kts)
- Swift (.swift)
- C/C++ (.c, .h, .cpp, .hpp, .cc, .cxx, .hh, .hxx)
- Markdown (.md, .mdx)

## File Ignoring

Automatically ignored:

- `.git`, `.svn`, `.hg`, `.DS_Store` (always)
- `node_modules`, `vendor`, `dist`, `build`, `__pycache__`, `venv`, `target`, `bin`, `obj`, `coverage`
- Patterns from `.gitignore`
- Custom patterns via `--ignore` parameter

## MCP Server

`code-tree` also provides an MCP (Model Context Protocol) server for integration with LLM clients like Claude Code.

The MCP server exposes the same capabilities and parameters as the CLI.

### Integration Example

Add to Claude Code MCP configuration:

```json
{
  "mcpServers": {
    "code-tree": {
      "command": "bunx",
      "args": ["@febalist/code-tree", "code-tree-mcp"]
    }
  }
}
```
