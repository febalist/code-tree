import { registerLanguage } from "../languages.js";

const query = `
(class_declaration
  name: (type_identifier) @class.name) @class

(struct_declaration
  name: (type_identifier) @struct.name) @struct

(protocol_declaration
  name: (type_identifier) @interface.name) @interface

(function_declaration
  name: (simple_identifier) @function.name) @function

(enum_declaration
  name: (type_identifier) @enum.name) @enum
`;

registerLanguage({
  name: "swift",
  wasmFile: "tree-sitter-swift.wasm",
  extensions: [".swift"],
  queryString: query,
  docCommentPrefixes: ["///", "/**"],
});
