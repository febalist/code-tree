import type { CodeSymbol, FileSymbols } from "../parser/types.js";
import type { WalkEntry, WalkResult } from "../scanner/walker.js";

export interface DirectoryFormatterOptions {
  includeSymbols: boolean;
  includeComments: boolean;
}

export function formatDirectory(
  result: WalkResult,
  fileSymbolsMap: Map<string, FileSymbols>,
  options: DirectoryFormatterOptions,
): string {
  const lines: string[] = [];

  function formatEntry(entry: WalkEntry, indent: string = "") {
    const isDir = entry.isDirectory;
    const displayName = isDir ? `${entry.name}/` : entry.name;

    lines.push(`${indent}${displayName}`);

    // Add symbols if this is a file and symbols are enabled
    if (!isDir && options.includeSymbols && fileSymbolsMap.has(entry.path)) {
      const fileSymbols = fileSymbolsMap.get(entry.path);
      if (fileSymbols) {
        const symbolIndent = `${indent}  `;
        formatSymbols(
          fileSymbols.symbols,
          symbolIndent,
          options.includeComments,
        );
      }
    }

    if (entry.children && entry.children.length > 0) {
      const childIndent = `${indent}  `;
      for (const child of entry.children) {
        formatEntry(child, childIndent);
      }
    }
  }

  function formatSymbols(
    symbols: CodeSymbol[],
    indent: string,
    includeComments: boolean,
  ) {
    for (const symbol of symbols) {
      // Add docblock if enabled
      if (includeComments && symbol.docblock) {
        const docLines = symbol.docblock.split("\n");
        for (const line of docLines) {
          lines.push(`${indent}/// ${line}`);
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

      lines.push(`${indent}${display}`);

      // Add children (methods in classes, etc.)
      if (symbol.children && symbol.children.length > 0) {
        formatSymbols(symbol.children, `${indent}  `, includeComments);
      }
    }
  }

  formatEntry(result.root);

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
