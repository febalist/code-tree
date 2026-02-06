import { registerLanguage } from "../languages.js";

const query = `
(function_item
  name: (identifier) @function.name) @function

(struct_item
  name: (type_identifier) @struct.name) @struct

(enum_item
  name: (type_identifier) @enum.name) @enum

(trait_item
  name: (type_identifier) @trait.name) @trait

(impl_item
  trait: (type_identifier)? @trait.name
  type: (type_identifier) @class.name) @class

(mod_item
  name: (identifier) @module.name) @module

(type_item
  name: (type_identifier) @type.name) @type
`;

registerLanguage({
  name: "rust",
  wasmFile: "tree-sitter-rust.wasm",
  extensions: [".rs"],
  queryString: query,
  docCommentPrefixes: ["///", "/**"],
});
