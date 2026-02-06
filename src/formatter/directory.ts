import type { CodeSymbol, FileSymbols } from "../parser/types.js";
import type { WalkEntry, WalkResult } from "../scanner/walker.js";

export interface DirectoryFormatterOptions {
  includeSymbols: boolean;
  includeComments: boolean;
}

const BRANCH = "├── "; // for non-last elements
const LAST = "└── "; // for last element
const PIPE = "│   "; // continuation from non-last ancestor
const SPACE = "    "; // empty space after last ancestor

export function formatDirectory(
  result: WalkResult,
  fileSymbolsMap: Map<string, FileSymbols>,
  options: DirectoryFormatterOptions,
): string {
  const lines: string[] = [];

  function formatEntry(
    entry: WalkEntry,
    prefix: string = "",
    isLast: boolean = true,
    isRoot: boolean = false,
  ) {
    const isDir = entry.isDirectory;
    const displayName = isDir ? `${entry.name}/` : entry.name;

    // Root element without connector, others with connectors
    if (isRoot) {
      lines.push(displayName);
    } else {
      lines.push(`${prefix}${isLast ? LAST : BRANCH}${displayName}`);
    }

    // Add symbols if this is a file and symbols are enabled
    if (!isDir && options.includeSymbols && fileSymbolsMap.has(entry.path)) {
      const fileSymbols = fileSymbolsMap.get(entry.path);
      if (fileSymbols) {
        // Symbols without tree connectors, only line continuation
        const symbolPrefix = isRoot ? "" : `${prefix}${isLast ? SPACE : PIPE}`;
        formatSymbols(
          fileSymbols.symbols,
          symbolPrefix,
          options.includeComments,
        );
      }
    }

    if (entry.children && entry.children.length > 0) {
      // For root children, start with empty prefix, for others extend with PIPE/SPACE
      const childPrefix = isRoot ? "" : `${prefix}${isLast ? SPACE : PIPE}`;
      for (let i = 0; i < entry.children.length; i++) {
        const child = entry.children[i];
        if (!child) continue;
        const childIsLast = i === entry.children.length - 1;
        formatEntry(child, childPrefix, childIsLast, false);
      }
    }
  }

  function formatSymbols(
    symbols: CodeSymbol[],
    prefix: string,
    includeComments: boolean,
  ) {
    for (const symbol of symbols) {
      // Add docblock if enabled
      if (includeComments && symbol.docblock) {
        const docLines = symbol.docblock.split("\n");
        for (const line of docLines) {
          lines.push(`${prefix}  /// ${line}`);
        }
      }

      // Add symbol
      let display = `${getKindPrefix(symbol.kind)} ${symbol.name}`;

      // Add signature for functions/methods
      if (
        (symbol.kind === "function" || symbol.kind === "method") &&
        symbol.signature
      ) {
        display = symbol.signature;
      }

      // Symbols with additional indent, without tree connectors
      lines.push(`${prefix}  ${display}`);

      // Add children (methods in classes, etc.)
      if (symbol.children && symbol.children.length > 0) {
        formatSymbols(symbol.children, `${prefix}  `, includeComments);
      }
    }
  }

  formatEntry(result.root, "", true, true);

  if (result.truncated) {
    lines.push("");
    lines.push(
      `[Truncated: showing ${result.totalEntries} entries. Use 'depth' or 'ignore' parameters to narrow scope.]`,
    );
  }

  return lines.join("\n");
}

function getKindPrefix(kind: string): string {
  switch (kind) {
    case "function":
    case "method":
      return "fn";
    case "class":
      return "class";
    case "interface":
      return "interface";
    case "type":
      return "type";
    case "enum":
      return "enum";
    case "struct":
      return "struct";
    case "trait":
      return "trait";
    case "namespace":
    case "module":
      return "namespace";
    case "constant":
      return "const";
    default:
      return kind;
  }
}
