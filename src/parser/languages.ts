import type { CodeSymbol } from "./types.js";

export interface LanguageConfig {
  name: string;
  wasmFile?: string;
  extensions: string[];
  queryString?: string;
  docCommentPrefixes: string[];
  customExtractor?: (content: string) => CodeSymbol[];
}

// Registry mapping file extensions to language configs
export const languageRegistry: Record<string, LanguageConfig> = {};

export function registerLanguage(config: LanguageConfig) {
  for (const ext of config.extensions) {
    languageRegistry[ext] = config;
  }
}

export function getLanguageByExtension(
  extension: string,
): LanguageConfig | null {
  return languageRegistry[extension] || null;
}
