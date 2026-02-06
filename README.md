# glance

A CLI tool for quickly exploring project structure and codebase.

## Features

- 🌳 Directory structure scanning (like `tree`)
- 🔍 Code symbol extraction: classes, functions, interfaces, types
- 📝 Doc comment support
- 🚀 Accurate AST parsing via Tree-sitter (WASM)
- 🎯 12 programming languages: TypeScript, JavaScript, Python, Go, PHP, Rust, Java, C#, Ruby, Kotlin, Swift, C/C++
- ⚡ Automatic output optimization

## Installation

```bash
bun install
```

## Usage

```bash
# Scan current directory
bun run src/index.ts .

# Scan specific directory
bun run src/index.ts src/

# Parse specific file
bun run src/index.ts src/index.ts

# Multiple paths
bun run src/index.ts src/ lib/

# With options
bun run src/index.ts --depth 2 --no-symbols .
bun run src/index.ts --ignore "*.test.ts" --ignore "*.spec.ts" src/

# Help
bun run src/index.ts --help
```

## Parameters

- **Positional arguments**: Paths to directories or files (default: `.`)
- `--depth <n>`: Maximum traversal depth (default: 10)
- `--symbols` / `--no-symbols`: Include/exclude code symbols (default: auto)
- `--comments` / `--no-comments`: Include/exclude doc comments (default: auto)
- `--ignore <pattern>`: Additional ignore patterns (repeatable)

## Auto-modes

### `symbols`
- For files: always `true`
- For directories: always `true`

### `comments`
- For files: always `true`
- For directories: `true` if output ≤ 5000 chars, otherwise `false`

## Output Examples

**Directory with symbols:**
```
src/
  index.ts
    async run({ args }) {
  parser/
    index.ts
      class ParserManager
        constructor() {
        async init() {
        async parseFile(filePath: string): Promise<FileSymbols | null> {
    types.ts
      type SymbolKind
      interface CodeSymbol
      interface FileSymbols
```

**File with detailed breakdown:**
```
src/parser/index.ts

  class ParserManager
    constructor() {
    async init() {
    private async loadLanguage(config: LanguageConfig): Promise<Language> {
    async parseFile(filePath: string): Promise<FileSymbols | null> {
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

## File Ignoring

Automatically ignored:

- `.git`, `.svn`, `.hg`, `.DS_Store` (always)
- `node_modules`, `dist`, `build`, `.next`, and other standard directories
- Patterns from `.gitignore`
- Custom patterns via `--ignore` parameter

## Development

```bash
# Check code
bun run check

# Format
bun biome check --write
```

## Technologies

- [Bun](https://bun.sh) - JavaScript runtime
- [citty](https://github.com/unjs/citty) - CLI framework
- [web-tree-sitter](https://github.com/tree-sitter/tree-sitter) - AST parsing
- [tree-sitter-wasms](https://www.npmjs.com/package/tree-sitter-wasms) - WASM grammars
- [ignore](https://www.npmjs.com/package/ignore) - .gitignore parsing
