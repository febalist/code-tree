import { registerLanguage } from "../languages.js";

const query = `
(function_definition
  declarator: (function_declarator
    declarator: (identifier) @function.name)) @function

(struct_specifier
  name: (type_identifier) @struct.name) @struct

(enum_specifier
  name: (type_identifier) @enum.name) @enum

(type_definition
  declarator: (type_identifier) @type.name) @type
`;

registerLanguage({
  name: "c",
  wasmFile: "tree-sitter-c.wasm",
  extensions: [".c", ".h"],
  queryString: query,
  docCommentPrefixes: ["/**", "///"],
});

// C++ uses the same grammar
registerLanguage({
  name: "cpp",
  wasmFile: "tree-sitter-cpp.wasm",
  extensions: [".cpp", ".cc", ".cxx", ".hpp", ".hh", ".hxx"],
  queryString: query,
  docCommentPrefixes: ["/**", "///"],
});
