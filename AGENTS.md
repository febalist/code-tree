# AGENTS.md

This file provides guidance for coding agents working with code in this repository.

## Commands

- `bun install` — install dependencies
- `bun run start` or `bun run src/index.ts [args]` — run from source
- `bun run build` — compile to standalone binary (`bun build --compile`)
- `bun test` — run tests
- `bun test --watch` — run tests in watch mode
- `bun test --update-snapshots` — update test snapshots
- `bun run check` — lint + type-check (`biome check && tsc --noEmit`)
- `bun run format` — auto-fix lint/format (`biome check --write`)

## Architecture

CLI tool that scans directory structures and extracts code symbols (classes, functions, interfaces, etc.) using Tree-sitter AST parsing. Runtime: Bun. CLI framework: citty. Entry point: `src/index.ts`.

Four modules:

- **scanner/** — `DirectoryWalker` traverses directories, `IgnoreManager` handles `.gitignore` + hardcoded + custom ignore patterns
- **parser/** — `ParserManager` initializes web-tree-sitter WASM runtime once and reuses it. `extractor.ts` walks ASTs to extract symbols. Each language in `queries/*.ts` calls `registerLanguage()` as a side-effect import, collected via barrel `queries/index.ts`
- **formatter/** — `directory.ts` renders tree-style output for directories, `file.ts` renders flat output for single files, `utils.ts` has shared `getKindPrefix()`
- **tools/** — `codeTree()` orchestrates scanning → parsing → formatting

## Key Patterns

- **Language registration**: side-effect imports in `src/parser/queries/*.ts` call `registerLanguage()` from `languages.ts`. Adding a language = new query file + import in `queries/index.ts` + WASM path in `wasm-assets.ts`
- **Markdown is special**: uses a custom regex-based extractor (`customExtractor`) instead of tree-sitter queries, extracting H1/H2 headings as nested section symbols
- **WASM loading**: uses Bun's `import ... with { type: "file" }` to get WASM file paths, loaded at runtime by web-tree-sitter
- **CLI args**: citty parses raw args, then zod schema (`CliArgsSchema`) validates and transforms them
- **Safety limits**: MAX_FILE_SIZE=1MB, MAX_ENTRIES=2000 files, MAX_FILES_TO_PARSE=500, signature length ≤ 200 chars

## Code Style

- Biome: spaces for indentation, double quotes, recommended lint rules, auto-organized imports
- All code in English

## Commit Messages

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/) specification. The format is:

```
type(scope): subject

body
```

**Types**: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`, `style`
**Scope**: Optional, the module/component affected (e.g., `parser`, `scanner`, `formatter`)
**Subject**: Imperative mood, lowercase, no period, max 50 characters
**Body**: Detailed explanation, max 100 characters per line

Examples:
- `feat(parser): add TypeScript support`
- `fix(scanner): handle symlinks correctly`
- `refactor: extract option schemas to separate module`

The repository uses commitlint to enforce this format automatically.
