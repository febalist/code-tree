import { registerLanguage } from "../languages.js";

const query = `
(class_definition
  name: (identifier) @class.name) @class

(function_definition
  name: (identifier) @function.name) @function
`;

registerLanguage({
  name: "python",
  wasmFile: "tree-sitter-python.wasm",
  extensions: [".py", ".pyw"],
  queryString: query,
  docCommentPrefixes: ["#"],
});
