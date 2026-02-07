import { describe, expect, test } from "bun:test";
import type { FileSymbols } from "../parser/types.js";
import type { WalkResult } from "../scanner/walker.js";
import { formatDirectory } from "./directory.js";

describe("formatDirectory", () => {
  test("single file in root directory", () => {
    const result: WalkResult = {
      root: {
        path: "/test",
        name: "test",
        isDirectory: true,
        depth: 0,
        children: [
          {
            path: "/test/file.ts",
            name: "file.ts",
            isDirectory: false,
            depth: 1,
          },
        ],
      },
      truncated: false,
      totalEntries: 2,
    };
    const fileSymbolsMap = new Map<string, FileSymbols>();
    expect(
      formatDirectory(result, fileSymbolsMap, {
        includeSymbols: false,
        includeComments: false,
      }),
    ).toMatchSnapshot();
  });

  test("multiple files with connectors", () => {
    const result: WalkResult = {
      root: {
        path: "/test",
        name: "test",
        isDirectory: true,
        depth: 0,
        children: [
          {
            path: "/test/a.ts",
            name: "a.ts",
            isDirectory: false,
            depth: 1,
          },
          {
            path: "/test/b.ts",
            name: "b.ts",
            isDirectory: false,
            depth: 1,
          },
          {
            path: "/test/c.ts",
            name: "c.ts",
            isDirectory: false,
            depth: 1,
          },
        ],
      },
      truncated: false,
      totalEntries: 4,
    };
    const fileSymbolsMap = new Map<string, FileSymbols>();
    expect(
      formatDirectory(result, fileSymbolsMap, {
        includeSymbols: false,
        includeComments: false,
      }),
    ).toMatchSnapshot();
  });

  test("nested directories", () => {
    const result: WalkResult = {
      root: {
        path: "/test",
        name: "test",
        isDirectory: true,
        depth: 0,
        children: [
          {
            path: "/test/src",
            name: "src",
            isDirectory: true,
            depth: 1,
            children: [
              {
                path: "/test/src/index.ts",
                name: "index.ts",
                isDirectory: false,
                depth: 2,
              },
            ],
          },
        ],
      },
      truncated: false,
      totalEntries: 3,
    };
    const fileSymbolsMap = new Map<string, FileSymbols>();
    expect(
      formatDirectory(result, fileSymbolsMap, {
        includeSymbols: false,
        includeComments: false,
      }),
    ).toMatchSnapshot();
  });

  test("symbols rendered under files", () => {
    const result: WalkResult = {
      root: {
        path: "/test",
        name: "test",
        isDirectory: true,
        depth: 0,
        children: [
          {
            path: "/test/app.ts",
            name: "app.ts",
            isDirectory: false,
            depth: 1,
          },
        ],
      },
      truncated: false,
      totalEntries: 2,
    };
    const fileSymbolsMap = new Map<string, FileSymbols>([
      [
        "/test/app.ts",
        {
          path: "/test/app.ts",
          language: "typescript",
          symbols: [
            {
              name: "main",
              kind: "function",
              line: 1,
              signature: "function main(): void",
            },
          ],
        },
      ],
    ]);
    expect(
      formatDirectory(result, fileSymbolsMap, {
        includeSymbols: true,
        includeComments: false,
      }),
    ).toMatchSnapshot();
  });

  test("symbols with docblocks when comments enabled", () => {
    const result: WalkResult = {
      root: {
        path: "/test",
        name: "test",
        isDirectory: true,
        depth: 0,
        children: [
          {
            path: "/test/app.ts",
            name: "app.ts",
            isDirectory: false,
            depth: 1,
          },
        ],
      },
      truncated: false,
      totalEntries: 2,
    };
    const fileSymbolsMap = new Map<string, FileSymbols>([
      [
        "/test/app.ts",
        {
          path: "/test/app.ts",
          language: "typescript",
          symbols: [
            {
              name: "greet",
              kind: "function",
              line: 1,
              signature: "function greet(name: string): string",
              docblock: "Greets a person",
            },
          ],
        },
      ],
    ]);
    expect(
      formatDirectory(result, fileSymbolsMap, {
        includeSymbols: true,
        includeComments: true,
      }),
    ).toMatchSnapshot();
  });

  test("symbols with docblocks when comments disabled", () => {
    const result: WalkResult = {
      root: {
        path: "/test",
        name: "test",
        isDirectory: true,
        depth: 0,
        children: [
          {
            path: "/test/app.ts",
            name: "app.ts",
            isDirectory: false,
            depth: 1,
          },
        ],
      },
      truncated: false,
      totalEntries: 2,
    };
    const fileSymbolsMap = new Map<string, FileSymbols>([
      [
        "/test/app.ts",
        {
          path: "/test/app.ts",
          language: "typescript",
          symbols: [
            {
              name: "greet",
              kind: "function",
              line: 1,
              signature: "function greet(name: string): string",
              docblock: "Greets a person",
            },
          ],
        },
      ],
    ]);
    expect(
      formatDirectory(result, fileSymbolsMap, {
        includeSymbols: true,
        includeComments: false,
      }),
    ).toMatchSnapshot();
  });

  test("truncated result shows message", () => {
    const result: WalkResult = {
      root: {
        path: "/test",
        name: "test",
        isDirectory: true,
        depth: 0,
        children: [],
      },
      truncated: true,
      totalEntries: 1000,
    };
    const fileSymbolsMap = new Map<string, FileSymbols>();
    const output = formatDirectory(result, fileSymbolsMap, {
      includeSymbols: false,
      includeComments: false,
    });
    expect(output).toContain("Truncated");
    expect(output).toContain("1000");
    expect(output).toMatchSnapshot();
  });

  test("empty directory", () => {
    const result: WalkResult = {
      root: {
        path: "/test",
        name: "test",
        isDirectory: true,
        depth: 0,
        children: [],
      },
      truncated: false,
      totalEntries: 1,
    };
    const fileSymbolsMap = new Map<string, FileSymbols>();
    expect(
      formatDirectory(result, fileSymbolsMap, {
        includeSymbols: false,
        includeComments: false,
      }),
    ).toMatchSnapshot();
  });

  test("class with methods in tree", () => {
    const result: WalkResult = {
      root: {
        path: "/test",
        name: "test",
        isDirectory: true,
        depth: 0,
        children: [
          {
            path: "/test/class.ts",
            name: "class.ts",
            isDirectory: false,
            depth: 1,
          },
        ],
      },
      truncated: false,
      totalEntries: 2,
    };
    const fileSymbolsMap = new Map<string, FileSymbols>([
      [
        "/test/class.ts",
        {
          path: "/test/class.ts",
          language: "typescript",
          symbols: [
            {
              name: "Calculator",
              kind: "class",
              line: 1,
              children: [
                {
                  name: "add",
                  kind: "method",
                  line: 2,
                  signature: "add(a: number, b: number): number",
                },
              ],
            },
          ],
        },
      ],
    ]);
    expect(
      formatDirectory(result, fileSymbolsMap, {
        includeSymbols: true,
        includeComments: false,
      }),
    ).toMatchSnapshot();
  });
});
