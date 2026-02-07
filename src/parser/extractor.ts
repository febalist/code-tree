import type { Node, Tree } from "web-tree-sitter";
import { Query } from "web-tree-sitter";
import type { LanguageConfig } from "./languages.js";
import type { CodeSymbol, SymbolKind } from "./types.js";

export function extractSymbols(
  tree: Tree,
  source: string,
  config: LanguageConfig,
): CodeSymbol[] {
  if (!config.queryString) {
    throw new Error(`Language ${config.name} has no query string configured`);
  }

  // Split source into lines once for reuse
  const lines = source.split("\n");

  // Parse query
  const query = new Query(tree.language, config.queryString);
  const captures = query.captures(tree.rootNode);

  // Collect base names with .name variants
  const hasNameCapture = new Set<string>();
  for (const capture of captures) {
    if (capture.name.endsWith(".name")) {
      hasNameCapture.add(capture.name.slice(0, -5));
    }
  }

  // Filter: keep .name captures + standalone captures (TypeScript-style)
  const relevantCaptures = captures.filter((capture) => {
    if (capture.name.endsWith(".name")) return true;
    return !hasNameCapture.has(capture.name); // skip outer when .name exists
  });

  // Group captures by parent nodes
  const symbolMap = new Map<number, CodeSymbol>();

  for (const capture of relevantCaptures) {
    // Captured node is the name, get the parent declaration
    const nameNode = capture.node;
    const declNode = nameNode.parent;
    if (!declNode) continue;

    const captureName = capture.name;

    // Extract name
    const name = nameNode.text;
    if (!name) continue;

    // Extract base kind name (remove .name suffix if present)
    const kindName = captureName.endsWith(".name")
      ? captureName.slice(0, -5)
      : captureName;

    // Determine kind from capture name
    let kind: SymbolKind = "function";
    if (kindName === "class") {
      kind = "class";
    } else if (kindName === "interface") {
      kind = "interface";
    } else if (kindName === "function") {
      kind = "function";
    } else if (kindName === "method") {
      kind = "method";
    } else if (kindName === "type") {
      kind = "type";
    } else if (kindName === "enum") {
      kind = "enum";
    } else if (kindName === "namespace" || kindName === "module") {
      kind = "namespace";
    } else if (kindName === "struct") {
      kind = "struct";
    } else if (kindName === "trait") {
      kind = "trait";
    } else if (kindName === "constant") {
      kind = "constant";
    } else if (kindName === "package") {
      kind = "package";
    } else if (kindName === "section") {
      kind = "section";
    }

    // Extract signature (for functions/methods)
    let signature = "";
    if (kind === "function" || kind === "method") {
      signature = getNodeSignature(declNode, lines);
    }

    // Extract docblock
    const docblock = extractDocblock(declNode, config.docCommentPrefixes);

    // Check visibility (for methods/fields)
    let visibility: CodeSymbol["visibility"];
    if (kind === "method" || kind === "function") {
      visibility = getVisibility(declNode);
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

  for (const capture of relevantCaptures) {
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

function getNodeSignature(node: Node, lines: string[]): string {
  // Try to get full signature - may span multiple lines
  const startPos = node.startPosition;
  const endPos = node.endPosition;

  // Collect lines from start to end or until we hit { outside of parameters
  const signatureLines: string[] = [];
  let parenDepth = 0;

  for (let i = startPos.row; i <= Math.min(endPos.row, startPos.row + 5); i++) {
    const line = lines[i] || "";
    let stopIndex = -1;

    // Track parentheses and braces
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === "(") parenDepth++;
      else if (char === ")") parenDepth--;
      else if (char === "{" && parenDepth === 0) {
        // Found { outside of parameters - stop here
        stopIndex = j;
        break;
      }
    }

    if (stopIndex !== -1) {
      signatureLines.push(line.slice(0, stopIndex));
      break;
    }

    signatureLines.push(line);

    // Stop if we closed all parens
    if (parenDepth === 0 && line.includes(")")) {
      break;
    }
  }

  // Join and clean up
  let signature = signatureLines.join(" ").trim();

  // Remove trailing { and : and ,
  signature = signature.replace(/\s*[{:,]\s*$/, "");

  // Normalize whitespace
  signature = signature.replace(/\s+/g, " ");

  // Remove trailing comma before closing paren
  signature = signature.replace(/,\s*\)/g, ")");

  // Clean up spaces around parentheses
  signature = signature.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")");

  // Limit length
  if (signature.length > 200) {
    signature = `${signature.slice(0, 197)}...`;
  }

  return signature;
}

function extractDocblock(node: Node, prefixes: string[]): string | null {
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
        .replace(/^\s*\*\s?/gm, "") // multiline flag to remove * from all lines
        .trim();
    })
    .join("\n")
    .trim();
}

function getVisibility(node: Node): CodeSymbol["visibility"] {
  // Check direct children for visibility modifiers
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (!child) continue;
    const type = child.type;
    if (type === "accessibility_modifier" || type === "visibility_modifier") {
      const text = child.text;
      if (text === "private") return "private";
      if (text === "protected") return "protected";
      if (text === "public") return "public";
    }
    // Check for export keyword
    if (type === "export") return "export";
    // Stop at function body
    if (type === "statement_block" || type === "block" || type === "class_body")
      break;
  }

  // Fallback: check first line of declaration text
  const firstLine = node.text.split("\n")[0] || "";
  if (/\bexport\b/.test(firstLine)) return "export";
  if (/\bprivate\b/.test(firstLine)) return "private";
  if (/\bprotected\b/.test(firstLine)) return "protected";
  if (/\bpublic\b/.test(firstLine)) return "public";

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
