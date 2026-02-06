import { registerLanguage } from "../languages.js";

const query = `
(class_declaration
  name: (identifier) @class.name) @class

(interface_declaration
  name: (identifier) @interface.name) @interface

(struct_declaration
  name: (identifier) @struct.name) @struct

(enum_declaration
  name: (identifier) @enum.name) @enum

(method_declaration
  name: (identifier) @method.name) @method

(namespace_declaration
  name: (identifier) @namespace.name) @namespace
`;

registerLanguage({
  name: "csharp",
  wasmFile: "tree-sitter-c_sharp.wasm",
  extensions: [".cs"],
  queryString: query,
  docCommentPrefixes: ["///", "/**"],
});
