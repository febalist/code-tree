export type SymbolKind =
  | "namespace"
  | "module"
  | "package"
  | "class"
  | "struct"
  | "interface"
  | "trait"
  | "function"
  | "method"
  | "type"
  | "enum"
  | "constant"
  | "section";

export interface CodeSymbol {
  name: string;
  kind: SymbolKind;
  signature?: string;
  docblock?: string;
  line: number;
  children?: CodeSymbol[];
  visibility?: "public" | "private" | "protected" | "export";
}

export interface FileSymbols {
  path: string;
  language: string;
  symbols: CodeSymbol[];
}
