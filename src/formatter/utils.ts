import type { SymbolKind } from "../parser/types.js";

export function getKindPrefix(kind: SymbolKind): string {
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
    case "package":
      return "package";
    case "section":
      return "#";
    default:
      return kind;
  }
}
