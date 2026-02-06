import { registerLanguage } from "../languages.js";

const query = `
(class_declaration
  name: (identifier) @class.name) @class

(function_declaration
  name: (identifier) @function.name) @function

(method_definition
  name: (property_identifier) @method.name) @method

(variable_declarator
  name: (identifier) @function.name
  value: [(arrow_function) (function_expression)]) @function
`;

registerLanguage({
  name: "javascript",
  wasmFile: "tree-sitter-javascript.wasm",
  extensions: [".js", ".jsx", ".mjs", ".cjs"],
  queryString: query,
  docCommentPrefixes: ["/**", "///"],
});
