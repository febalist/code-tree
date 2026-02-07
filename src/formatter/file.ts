import { basename } from "node:path";
import type { CodeSymbol, FileSymbols } from "../parser/types.js";
import { getKindPrefix } from "./utils.js";

export interface FileFormatterOptions {
  includeComments: boolean;
}

export function formatFile(
  fileSymbols: FileSymbols,
  options: FileFormatterOptions,
): string {
  const lines: string[] = [];

  lines.push(basename(fileSymbols.path));
  lines.push("");

  function formatSymbol(symbol: CodeSymbol, indent: string = "  ") {
    // Add docblock if present and enabled
    if (options.includeComments && symbol.docblock) {
      const docLines = symbol.docblock.split("\n");
      for (const line of docLines) {
        lines.push(`${indent}/// ${line}`);
      }
    }

    // Add symbol declaration
    let declaration = "";

    if (symbol.visibility) {
      declaration += `${symbol.visibility} `;
    }

    declaration += `${getKindPrefix(symbol.kind)} ${symbol.name}`;

    if (symbol.signature) {
      // Use signature if available
      declaration = `${indent}${symbol.signature}`;
    } else {
      declaration = `${indent}${declaration}`;
    }

    lines.push(declaration);

    // Add children
    if (symbol.children && symbol.children.length > 0) {
      const childIndent = `${indent}  `;
      for (const child of symbol.children) {
        formatSymbol(child, childIndent);
      }
    }
  }

  for (const symbol of fileSymbols.symbols) {
    formatSymbol(symbol);
  }

  return lines.join("\n");
}
