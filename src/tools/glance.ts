import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { formatDirectory } from "../formatter/directory.js";
import { formatFile } from "../formatter/file.js";
import { ParserManager } from "../parser/index.js";
import type { FileSymbols } from "../parser/types.js";
import { DirectoryWalker, type WalkEntry } from "../scanner/walker.js";
import "../parser/queries/index.js"; // Register all languages

export interface GlanceOptions {
  path: string;
  depth?: number | null;
  symbols?: boolean | null;
  comments?: boolean | null;
  ignore?: string[];
}

const DEFAULT_DEPTH = 10;
const MAX_ENTRIES = 2000;
const MAX_FILES_TO_PARSE = 500;
const AUTO_COMMENTS_THRESHOLD = 5000; // characters

export async function glance(options: GlanceOptions): Promise<string> {
  const absolutePath = resolve(options.path);

  // Check if path exists
  let stats: Awaited<ReturnType<typeof stat>>;
  try {
    stats = await stat(absolutePath);
  } catch {
    throw new Error(`Path not found: ${options.path}`);
  }

  // Determine actual depth to use
  const depth = options.depth ?? DEFAULT_DEPTH;

  // If it's a file, handle separately
  if (!stats.isDirectory()) {
    return await handleFile(absolutePath, options);
  }

  // Handle directory mode
  return await handleDirectory(absolutePath, depth, options);
}

async function handleFile(
  filePath: string,
  options: GlanceOptions,
): Promise<string> {
  const includeComments = options.comments ?? true; // Auto: true for files

  const parser = new ParserManager();
  await parser.init();

  const fileSymbols = await parser.parseFile(filePath);

  if (!fileSymbols || fileSymbols.symbols.length === 0) {
    return `${filePath}\n\n[No symbols found or unsupported language]`;
  }

  return formatFile(fileSymbols, { includeComments });
}

async function handleDirectory(
  dirPath: string,
  depth: number,
  options: GlanceOptions,
): Promise<string> {
  const walker = new DirectoryWalker(dirPath, {
    maxDepth: depth,
    maxEntries: MAX_ENTRIES,
    ignorePatterns: options.ignore ?? [],
  });

  const result = await walker.walk();

  // Determine if we should parse symbols
  const includeSymbols = options.symbols ?? true; // Auto: true for directories

  const fileSymbolsMap = new Map<string, FileSymbols>();

  if (includeSymbols) {
    // Collect all files to parse
    const filesToParse = collectFiles(result.root);

    // Limit number of files to parse
    const limitedFiles = filesToParse.slice(0, MAX_FILES_TO_PARSE);

    // Initialize parser
    const parser = new ParserManager();
    await parser.init();

    // Parse all files
    for (const file of limitedFiles) {
      const fileSymbols = await parser.parseFile(file.path);
      if (fileSymbols && fileSymbols.symbols.length > 0) {
        fileSymbolsMap.set(file.path, fileSymbols);
      }
    }
  }

  // Auto-detect comments setting
  let includeComments = options.comments;

  if (includeComments === null || includeComments === undefined) {
    // Auto mode: try with comments first
    const withComments = formatDirectory(result, fileSymbolsMap, {
      includeSymbols,
      includeComments: true,
    });

    if (withComments.length <= AUTO_COMMENTS_THRESHOLD) {
      includeComments = true;
    } else {
      includeComments = false;
    }
  }

  return formatDirectory(result, fileSymbolsMap, {
    includeSymbols,
    includeComments,
  });
}

function collectFiles(entry: WalkEntry): WalkEntry[] {
  const files: WalkEntry[] = [];

  if (!entry.isDirectory) {
    files.push(entry);
  }

  if (entry.children) {
    for (const child of entry.children) {
      files.push(...collectFiles(child));
    }
  }

  return files;
}
