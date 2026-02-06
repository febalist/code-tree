// Core tree-sitter engine WASM

import cWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-c.wasm" with {
  type: "file",
};
import csharpWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-c_sharp.wasm" with {
  type: "file",
};
import cppWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-cpp.wasm" with {
  type: "file",
};
import goWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-go.wasm" with {
  type: "file",
};
import javaWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-java.wasm" with {
  type: "file",
};
import jsWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-javascript.wasm" with {
  type: "file",
};
import kotlinWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-kotlin.wasm" with {
  type: "file",
};
import phpWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-php.wasm" with {
  type: "file",
};
import pyWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-python.wasm" with {
  type: "file",
};
import rubyWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-ruby.wasm" with {
  type: "file",
};
import rustWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-rust.wasm" with {
  type: "file",
};
import swiftWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-swift.wasm" with {
  type: "file",
};
// Language grammar WASMs
import tsWasm from "../../node_modules/tree-sitter-wasms/out/tree-sitter-typescript.wasm" with {
  type: "file",
};
import treeSitterWasmPath from "../../node_modules/web-tree-sitter/tree-sitter.wasm" with {
  type: "file",
};

export const treeSitterWasm: string = treeSitterWasmPath;

export const grammarWasmPaths: Record<string, string> = {
  "tree-sitter-typescript.wasm": tsWasm,
  "tree-sitter-javascript.wasm": jsWasm,
  "tree-sitter-python.wasm": pyWasm,
  "tree-sitter-go.wasm": goWasm,
  "tree-sitter-php.wasm": phpWasm,
  "tree-sitter-rust.wasm": rustWasm,
  "tree-sitter-java.wasm": javaWasm,
  "tree-sitter-c_sharp.wasm": csharpWasm,
  "tree-sitter-c.wasm": cWasm,
  "tree-sitter-cpp.wasm": cppWasm,
  "tree-sitter-ruby.wasm": rubyWasm,
  "tree-sitter-kotlin.wasm": kotlinWasm,
  "tree-sitter-swift.wasm": swiftWasm,
};
