# Changelog

## [1.0.1](https://github.com/febalist/code-tree/compare/v1.0.0...v1.0.1) (2026-02-07)


### Bug Fixes

* support mcp subcommand for bunx integration ([cf6ced5](https://github.com/febalist/code-tree/commit/cf6ced5951d6191a0a75fafefed4f017e85806e5))

## 1.0.0 (2026-02-07)


### ⚠ BREAKING CHANGES

* rename tool from `glance` to `code-tree` and update references

### Features

* add CLI argument validation with Zod ([6134641](https://github.com/febalist/code-tree/commit/6134641075137671a73562926f878663cc45aa5a))
* add Markdown symbol extraction and custom language support ([65a5a8d](https://github.com/febalist/code-tree/commit/65a5a8dc4983d8420ef51caafb2b119f132350bb))
* embed tree-sitter WASM assets and add `build` script ([d050908](https://github.com/febalist/code-tree/commit/d0509086f5bacc444492968a47b81dc2be8c9d94))
* enhance CLI usage experience and improve symbol extraction ([8740293](https://github.com/febalist/code-tree/commit/8740293d1ca5f6bb1ea01cd347aaca9034f1ce60))
* enhance language support, optimize performance, and update metadata ([69dbe3f](https://github.com/febalist/code-tree/commit/69dbe3fdf36f74d9a63a34f07c068592fe8becf7))
* implement project structure scanner and code symbol extraction ([742fbc5](https://github.com/febalist/code-tree/commit/742fbc52f0e4fefa2e8282dcc960a24dd7ec5f78))
* improve README formatting and enhance directory tree visualization ([293ab00](https://github.com/febalist/code-tree/commit/293ab00c5920a04eefe81c997ad0b40b7a17072a))
* introduce MCP server integration and add `mcp` script ([6906297](https://github.com/febalist/code-tree/commit/690629719c1c0ba6f6a664cb95b3c4f08b7e740a))
* refine symbol extraction and update ignore rules ([fc9a268](https://github.com/febalist/code-tree/commit/fc9a268d476acd25edd12c28b8ae76e8f8b50cda))
* replace MCP server with CLI using Citty and add README ([2fd55f5](https://github.com/febalist/code-tree/commit/2fd55f5b920c6af5b4bdba37c703100b5d2a28e0))


### Bug Fixes

* adjust CLI usage string formatting and add WASM module declaration ([9d882b7](https://github.com/febalist/code-tree/commit/9d882b7ce8f175e0d34206f2ce657b9cadefe02d))
* correct Kotlin and Swift tree-sitter query patterns for WASM grammar compatibility ([9a7fb33](https://github.com/febalist/code-tree/commit/9a7fb330d002dfd3a4ab52299d4453ec6d405121))
* include all hidden directories in hardcoded ignores list ([74d3e1e](https://github.com/febalist/code-tree/commit/74d3e1e99c68a1d8ddb2a9b174d2086b7f706bee))
* replace placeholder in CLI usage string for better clarity ([d3ecfb5](https://github.com/febalist/code-tree/commit/d3ecfb5591fe0fd84c2e533079430307a6e996a4))
* simplify CLI argument parsing by removing redundant validation ([98912f3](https://github.com/febalist/code-tree/commit/98912f3d05b0438f6e0bfc2091aa0e0e2603e895))
* use basename for file path in file mode output and link release to CI ([f50d1d0](https://github.com/febalist/code-tree/commit/f50d1d09c68de0d8d168686ea70b9ccbeef3ec1b))


### Code Refactoring

* rename tool from `glance` to `code-tree` and update references ([9662391](https://github.com/febalist/code-tree/commit/966239119fc7559ef1a0b69295b80b3f84b44661))
