import { registerLanguage } from "../languages.js";

const query = `
(class_declaration
  "interface"
  (type_identifier) @interface.name) @interface

(class_declaration
  (type_identifier) @enum.name
  (enum_class_body)) @enum

(class_declaration
  "class"
  (type_identifier) @class.name
  (class_body)) @class

(object_declaration
  (type_identifier) @class.name) @class

(function_declaration
  (simple_identifier) @function.name) @function

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
