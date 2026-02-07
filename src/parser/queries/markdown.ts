import { registerLanguage } from "../languages.js";
import type { CodeSymbol } from "../types.js";

function extractMarkdownSymbols(content: string): CodeSymbol[] {
  const lines = content.split("\n");
  const symbols: CodeSymbol[] = [];
  let currentH1: CodeSymbol | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] || "";
    const trimmed = line.trim();

    // H1: ^#
    if (trimmed.startsWith("# ") && !trimmed.startsWith("##")) {
      const name = trimmed.slice(2).trim();
      if (name) {
        currentH1 = {
          name,
          kind: "section",
          line: i + 1,
        };
        symbols.push(currentH1);
      }
    }
    // H2: ^##
    else if (trimmed.startsWith("## ")) {
      const name = trimmed.slice(3).trim();
      if (name) {
        const h2: CodeSymbol = {
          name,
          kind: "section",
          line: i + 1,
        };

        // Nest under current H1 if available
        if (currentH1) {
          if (!currentH1.children) {
            currentH1.children = [];
          }
          currentH1.children.push(h2);
        } else {
          // No parent H1, add as top-level
          symbols.push(h2);
        }
      }
    }
  }

  return symbols;
}

registerLanguage({
  name: "markdown",
  extensions: [".md", ".mdx"],
  docCommentPrefixes: [],
  customExtractor: extractMarkdownSymbols,
});
