import { registerLanguage } from "../languages.js";

const query = `
(interface_declaration
  name: (type_identifier) @interface)

(class_declaration
  name: (type_identifier) @class)

(function_declaration
  name: (identifier) @function)

(method_definition
  name: (property_identifier) @method)

(type_alias_declaration
  name: (type_identifier) @type)

(enum_declaration
  name: (identifier) @enum)
`;

registerLanguage({
  name: "typescript",
  wasmFile: "tree-sitter-typescript.wasm",
  extensions: [".ts", ".tsx"],
  queryString: query,
  docCommentPrefixes: ["/**", "///"],
});
