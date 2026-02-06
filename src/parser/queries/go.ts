import { registerLanguage } from "../languages.js";

const query = `
(function_declaration
  name: (identifier) @function.name) @function

(method_declaration
  name: (field_identifier) @method.name) @method

(type_declaration
  (type_spec
    name: (type_identifier) @type.name
    type: (struct_type))) @struct

(type_declaration
  (type_spec
    name: (type_identifier) @type.name
    type: (interface_type))) @interface

(package_clause
  (package_identifier) @package.name) @package
`;

registerLanguage({
  name: "go",
  wasmFile: "tree-sitter-go.wasm",
  extensions: [".go"],
  queryString: query,
  docCommentPrefixes: ["//"],
});
