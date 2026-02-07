import { describe, expect, test } from "bun:test";
import type { FileSymbols } from "../parser/types.js";
import { formatFile } from "./file.js";

describe("formatFile", () => {
  test("simple function", () => {
    const fs: FileSymbols = {
      path: "example.ts",
      language: "typescript",
      symbols: [{ name: "hello", kind: "function", line: 1 }],
    };
    expect(formatFile(fs, { includeComments: false })).toMatchSnapshot();
  });

  test("function with signature", () => {
    const fs: FileSymbols = {
      path: "example.ts",
      language: "typescript",
      symbols: [
        {
          name: "add",
          kind: "function",
          line: 1,
          signature: "function add(a: number, b: number): number",
        },
      ],
    };
    expect(formatFile(fs, { includeComments: false })).toMatchSnapshot();
  });

  test("with docblock and comments enabled", () => {
    const fs: FileSymbols = {
      path: "example.ts",
      language: "typescript",
      symbols: [
        {
          name: "greet",
          kind: "function",
          line: 1,
          signature: "function greet(name: string): string",
          docblock: "Greets a person by name",
        },
      ],
    };
    expect(formatFile(fs, { includeComments: true })).toMatchSnapshot();
  });

  test("with docblock and comments disabled", () => {
    const fs: FileSymbols = {
      path: "example.ts",
      language: "typescript",
      symbols: [
        {
          name: "greet",
          kind: "function",
          line: 1,
          signature: "function greet(name: string): string",
          docblock: "Greets a person by name",
        },
      ],
    };
    expect(formatFile(fs, { includeComments: false })).toMatchSnapshot();
  });

  test("with visibility modifier", () => {
    const fs: FileSymbols = {
      path: "example.ts",
      language: "typescript",
      symbols: [
        {
          name: "calculate",
          kind: "function",
          line: 1,
          visibility: "export",
        },
      ],
    };
    expect(formatFile(fs, { includeComments: false })).toMatchSnapshot();
  });

  test("class with nested methods", () => {
    const fs: FileSymbols = {
      path: "example.ts",
      language: "typescript",
      symbols: [
        {
          name: "Calculator",
          kind: "class",
          line: 1,
          visibility: "export",
          children: [
            {
              name: "add",
              kind: "method",
              line: 2,
              signature: "add(a: number, b: number): number",
              visibility: "public",
            },
            {
              name: "subtract",
              kind: "method",
              line: 6,
              signature: "subtract(a: number, b: number): number",
              visibility: "private",
            },
          ],
        },
      ],
    };
    expect(formatFile(fs, { includeComments: false })).toMatchSnapshot();
  });

  test("deeply nested symbols", () => {
    const fs: FileSymbols = {
      path: "example.ts",
      language: "typescript",
      symbols: [
        {
          name: "Outer",
          kind: "class",
          line: 1,
          children: [
            {
              name: "Middle",
              kind: "class",
              line: 2,
              children: [
                {
                  name: "inner",
                  kind: "method",
                  line: 3,
                },
              ],
            },
          ],
        },
      ],
    };
    expect(formatFile(fs, { includeComments: false })).toMatchSnapshot();
  });

  test("multiline docblock", () => {
    const fs: FileSymbols = {
      path: "example.ts",
      language: "typescript",
      symbols: [
        {
          name: "calculate",
          kind: "function",
          line: 1,
          docblock:
            "Calculate something complex\nTakes multiple parameters\nReturns a result",
        },
      ],
    };
    expect(formatFile(fs, { includeComments: true })).toMatchSnapshot();
  });
});
