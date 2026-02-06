import { registerLanguage } from "../languages.js";

const query = `
(class_declaration
  name: (name) @class.name) @class

(function_definition
  name: (name) @function.name) @function

(method_declaration
  name: (name) @method.name) @method

(interface_declaration
  name: (name) @interface.name) @interface

(trait_declaration
  name: (name) @trait.name) @trait

(namespace_definition
  name: (namespace_name) @namespace.name) @namespace
`;

registerLanguage({
  name: "php",
  wasmFile: "tree-sitter-php.wasm",
  extensions: [".php"],
  queryString: query,
  docCommentPrefixes: ["/**", "///"],
});
