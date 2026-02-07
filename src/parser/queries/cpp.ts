import { registerLanguage } from "../languages.js";

// C++ extends C, so we include C queries plus C++ specific constructs
const query = `
; C queries (inherited)
(function_definition
  declarator: (function_declarator
    declarator: (identifier) @function.name)) @function

(struct_specifier
  name: (type_identifier) @struct.name) @struct

(enum_specifier
  name: (type_identifier) @enum.name) @enum

(type_definition
  declarator: (type_identifier) @type.name) @type

; C++ specific: Classes
(class_specifier
  name: (type_identifier) @class.name) @class

; C++ specific: Namespaces
(namespace_definition
  name: (_) @namespace.name) @namespace

; C++ specific: Template declarations
(template_declaration
  (function_definition
    declarator: (function_declarator
      declarator: (identifier) @template_function.name))) @template_function

(template_declaration
  (class_specifier
    name: (type_identifier) @template_class.name)) @template_class
`;

registerLanguage({
  name: "cpp",
  wasmFile: "tree-sitter-cpp.wasm",
  extensions: [".cpp", ".cc", ".cxx", ".hpp", ".hh", ".hxx"],
  queryString: query,
  docCommentPrefixes: ["/**", "///"],
});
