import type { Node, Tree } from "web-tree-sitter";
import { Query } from "web-tree-sitter";
import type { LanguageConfig } from "./languages.js";
import type { CodeSymbol, SymbolKind } from "./types.js";

export function extractSymbols(
  tree: Tree,
  source: string,
  config: LanguageConfig,
): CodeSymbol[] {
  const _symbols: CodeSymbol[] = [];

  // Parse query
  const query = new Query(tree.language, config.queryString);
  const captures = query.captures(tree.rootNode);

  // Group captures by parent nodes
  const symbolMap = new Map<number, CodeSymbol>();

  for (const capture of captures) {
    // Captured node is the name, get the parent declaration
    const nameNode = capture.node;
    const declNode = nameNode.parent;
    if (!declNode) continue;

    const captureName = capture.name;

    // Extract name
    const name = nameNode.text;
    if (!name) continue;

    // Determine kind from capture name
    let kind: SymbolKind = "function";
    if (captureName === "class") {
      kind = "class";
    } else if (captureName === "interface") {
      kind = "interface";
    } else if (captureName === "function") {
      kind = "function";
    } else if (captureName === "method") {
      kind = "method";
    } else if (captureName === "type") {
      kind = "type";
    } else if (captureName === "enum") {
      kind = "enum";
    } else if (captureName === "namespace" || captureName === "module") {
      kind = "namespace";
    } else if (captureName === "struct") {
      kind = "struct";
    } else if (captureName === "trait") {
      kind = "trait";
    } else if (captureName === "constant") {
      kind = "constant";
    } else if (captureName === "package") {
      kind = "package";
    }

    // Extract signature (for functions/methods)
    let signature = "";
    if (kind === "function" || kind === "method") {
      signature = getNodeSignature(declNode, source);
    }

    // Extract docblock
    const docblock = extractDocblock(
      declNode,
      source,
      config.docCommentPrefixes,
    );

    // Check visibility (for methods/fields)
    let visibility: CodeSymbol["visibility"];
    if (kind === "method" || kind === "function") {
      visibility = getVisibility(declNode, source);
    }

    const symbol: CodeSymbol = {
      name,
      kind,
      line: declNode.startPosition.row + 1,
      signature: signature || undefined,
      docblock: docblock || undefined,
      visibility,
    };

    symbolMap.set(declNode.id, symbol);
  }

  // Build hierarchy (methods inside classes, etc.)
  const rootSymbols: CodeSymbol[] = [];
  const nodeParents = new Map<number, number>();

  for (const capture of captures) {
    const nameNode = capture.node;
    const declNode = nameNode.parent;
    if (!declNode) continue;

    // Find parent symbol
    let parent = declNode.parent;
    while (parent) {
      if (symbolMap.has(parent.id)) {
        nodeParents.set(declNode.id, parent.id);
        break;
      }
      parent = parent.parent || null;
    }
  }

  // Organize into tree
  for (const [nodeId, symbol] of symbolMap.entries()) {
    const parentId = nodeParents.get(nodeId);
    if (parentId !== undefined) {
      const parent = symbolMap.get(parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(symbol);
      }
    } else {
      rootSymbols.push(symbol);
    }
  }

  // Sort symbols by line number
  sortSymbolsByLine(rootSymbols);

  return rootSymbols;
}

function getNodeSignature(node: Node, source: string): string {
  // Try to get full signature from first line
  const startPos = node.startPosition;
  const lines = source.split("\n");
  let signature = lines[startPos.row] || "";

  // Clean up signature
  signature = signature.trim();

  // Limit length
  if (signature.length > 200) {
    signature = `${signature.slice(0, 197)}...`;
  }

  return signature;
}

function extractDocblock(
  node: Node,
  _source: string,
  prefixes: string[],
): string | null {
  // Look for preceding sibling comment nodes
  let sibling = node.previousNamedSibling;

  const comments: string[] = [];

  while (sibling) {
    if (sibling.type === "comment") {
      const text = sibling.text.trim();

      // Check if it matches doc comment prefix
      const isDocComment = prefixes.some((prefix) => text.startsWith(prefix));

      if (isDocComment) {
        comments.unshift(text);
        sibling = sibling.previousNamedSibling;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  if (comments.length === 0) return null;

  // Clean up comment markers
  return comments
    .map((c) => {
      // Remove /** */ or /// markers
      return c
        .replace(/^\/\*\*/, "")
        .replace(/\*\/$/, "")
        .replace(/^\/\/\//, "")
        .replace(/^\s*\*\s?/, "")
        .trim();
    })
    .join("\n")
    .trim();
}

function getVisibility(node: Node, _source: string): CodeSymbol["visibility"] {
  // Check for visibility modifiers
  const text = node.text;

  if (/\bprivate\b/.test(text)) return "private";
  if (/\bprotected\b/.test(text)) return "protected";
  if (/\bpublic\b/.test(text)) return "public";
  if (/\bexport\b/.test(text)) return "export";

  return undefined;
}

function sortSymbolsByLine(symbols: CodeSymbol[]) {
  symbols.sort((a, b) => a.line - b.line);
  for (const symbol of symbols) {
    if (symbol.children) {
      sortSymbolsByLine(symbol.children);
    }
  }
}
