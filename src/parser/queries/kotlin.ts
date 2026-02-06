import { registerLanguage } from "../languages.js";

const query = `
(class_declaration
  (type_identifier) @class.name) @class

(object_declaration
  (type_identifier) @class.name) @class

(function_declaration
  (simple_identifier) @function.name) @function

(interface_declaration
  (type_identifier) @interface.name) @interface

(enum_class_declaration
  (type_identifier) @enum.name) @enum

(package_header
  (identifier) @package.name) @package
`;

registerLanguage({
  name: "kotlin",
  wasmFile: "tree-sitter-kotlin.wasm",
  extensions: [".kt", ".kts"],
  queryString: query,
  docCommentPrefixes: ["/**", "///"],
});
