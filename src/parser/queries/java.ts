import { registerLanguage } from "../languages.js";

const query = `
(class_declaration
  name: (identifier) @class.name) @class

(interface_declaration
  name: (identifier) @interface.name) @interface

(enum_declaration
  name: (identifier) @enum.name) @enum

(method_declaration
  name: (identifier) @method.name) @method

(package_declaration
  (scoped_identifier) @package.name) @package
`;

registerLanguage({
  name: "java",
  wasmFile: "tree-sitter-java.wasm",
  extensions: [".java"],
  queryString: query,
  docCommentPrefixes: ["/**", "///"],
});
