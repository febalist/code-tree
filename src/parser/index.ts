import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Language, Parser as TreeSitter } from "web-tree-sitter";
import { extractSymbols } from "./extractor.js";
import { getLanguageByExtension, type LanguageConfig } from "./languages.js";
import type { FileSymbols } from "./types.js";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

export class ParserManager {
  private parser: TreeSitter | null = null;
  private loadedLanguages = new Map<string, Language>();
  private wasmBasePath: string;

  constructor() {
    // Find tree-sitter-wasms package location
    const wasmsPkg = "tree-sitter-wasms";
    this.wasmBasePath = join(process.cwd(), "node_modules", wasmsPkg, "out");
  }

  async init() {
    if (this.parser) return;

    await TreeSitter.init();
    this.parser = new TreeSitter();
  }

  private async loadLanguage(config: LanguageConfig): Promise<Language> {
    if (!this.parser) {
      throw new Error("Parser not initialized");
    }

    // Check cache
    const cached = this.loadedLanguages.get(config.name);
    if (cached) return cached;

    // Load WASM grammar
    const wasmPath = join(this.wasmBasePath, config.wasmFile);
    const language = await Language.load(wasmPath);

    this.loadedLanguages.set(config.name, language);
    return language;
  }

  async parseFile(filePath: string): Promise<FileSymbols | null> {
    // Get language by file extension
    const ext = `.${filePath.split(".").pop()}`;
    const config = getLanguageByExtension(ext);

    if (!config) {
      // Unknown language, skip
      return null;
    }

    try {
      // Check file size
      const content = await readFile(filePath, "utf-8");
      if (content.length > MAX_FILE_SIZE) {
        return null; // Skip large files
      }

      // Load language and set parser
      const language = await this.loadLanguage(config);
      if (!this.parser) {
        throw new Error("Parser not initialized");
      }
      this.parser.setLanguage(language);

      // Parse
      const tree = this.parser.parse(content);
      if (!tree) {
        return null;
      }

      // Extract symbols
      const symbols = extractSymbols(tree, content, config);

      return {
        path: filePath,
        language: config.name,
        symbols,
      };
    } catch (error) {
      // Failed to parse, return null
      console.error(`Failed to parse ${filePath}:`, error);
      return null;
    }
  }
}
