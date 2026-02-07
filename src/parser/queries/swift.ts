import { registerLanguage } from "../languages.js";

const query = `
(class_declaration
  declaration_kind: "struct"
  name: (type_identifier) @struct.name) @struct

(class_declaration
  declaration_kind: "class"
  name: (type_identifier) @class.name) @class

(class_declaration
  declaration_kind: "enum"
  name: (type_identifier) @enum.name) @enum

(protocol_declaration
  name: (type_identifier) @interface.name) @interface

(function_declaration
  name: (simple_identifier) @function.name) @function
`;

registerLanguage({
  name: "swift",
  wasmFile: "tree-sitter-swift.wasm",
  extensions: [".swift"],
  queryString: query,
  docCommentPrefixes: ["///", "/**"],
});
