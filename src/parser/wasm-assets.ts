// Core tree-sitter engine WASM

// Language grammar WASMs
import cWasm from "tree-sitter-wasms/out/tree-sitter-c.wasm" with {
  type: "file",
};
import csharpWasm from "tree-sitter-wasms/out/tree-sitter-c_sharp.wasm" with {
  type: "file",
};
import cppWasm from "tree-sitter-wasms/out/tree-sitter-cpp.wasm" with {
  type: "file",
};
import goWasm from "tree-sitter-wasms/out/tree-sitter-go.wasm" with {
  type: "file",
};
import javaWasm from "tree-sitter-wasms/out/tree-sitter-java.wasm" with {
  type: "file",
};
import jsWasm from "tree-sitter-wasms/out/tree-sitter-javascript.wasm" with {
  type: "file",
};
import kotlinWasm from "tree-sitter-wasms/out/tree-sitter-kotlin.wasm" with {
  type: "file",
};
import phpWasm from "tree-sitter-wasms/out/tree-sitter-php.wasm" with {
  type: "file",
};
import pyWasm from "tree-sitter-wasms/out/tree-sitter-python.wasm" with {
  type: "file",
};
import rubyWasm from "tree-sitter-wasms/out/tree-sitter-ruby.wasm" with {
  type: "file",
};
import rustWasm from "tree-sitter-wasms/out/tree-sitter-rust.wasm" with {
  type: "file",
};
import swiftWasm from "tree-sitter-wasms/out/tree-sitter-swift.wasm" with {
  type: "file",
};
import tsWasm from "tree-sitter-wasms/out/tree-sitter-typescript.wasm" with {
  type: "file",
};
import treeSitterWasmPath from "web-tree-sitter/tree-sitter.wasm" with {
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
