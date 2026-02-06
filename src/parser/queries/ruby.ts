import { registerLanguage } from "../languages.js";

const query = `
(method
  name: (identifier) @method.name) @method

(singleton_method
  name: (identifier) @method.name) @method

(class
  name: (constant) @class.name) @class

(module
  name: (constant) @module.name) @module
`;

registerLanguage({
  name: "ruby",
  wasmFile: "tree-sitter-ruby.wasm",
  extensions: [".rb"],
  queryString: query,
  docCommentPrefixes: ["#"],
});
