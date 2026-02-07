import { beforeAll, describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { getTestParser } from "../../tests/setup.js";
import type { ParserManager } from "../parser/index.js";
import { codeTree } from "./code-tree.js";

const FIXTURES_DIR = resolve(import.meta.dir, "../../tests/fixtures");

let parser: ParserManager;

beforeAll(async () => {
  parser = await getTestParser();
});

describe("codeTree", () => {
  test("file mode: parses single TypeScript file", async () => {
    const output = await codeTree({
      path: resolve(FIXTURES_DIR, "sample.ts"),
      parser,
    });
    expect(output).toContain("sample.ts");
    expect(output).toMatchSnapshot();
  });

  test("directory mode: scans fixture project", async () => {
    const output = await codeTree({
      path: resolve(FIXTURES_DIR, "project"),
      parser,
    });
    expect(output).toContain("project");
    expect(output).toMatchSnapshot();
  });

  test("nonexistent path throws", async () => {
    await expect(
      codeTree({ path: "/nonexistent/path/that/does/not/exist" }),
    ).rejects.toThrow("Path not found");
  });

  test("symbols disabled shows tree only", async () => {
    const output = await codeTree({
      path: resolve(FIXTURES_DIR, "project"),
      symbols: false,
      parser,
    });
    // Should not contain symbol prefixes
    expect(output).not.toContain("fn ");
    expect(output).not.toContain("class ");
    expect(output).toMatchSnapshot();
  });

  test("comments disabled omits docblocks", async () => {
    const output = await codeTree({
      path: resolve(FIXTURES_DIR, "sample.ts"),
      comments: false,
      parser,
    });
    // Should not contain docblock marker
    expect(output).not.toContain("///");
    expect(output).toMatchSnapshot();
  });

  test("custom ignore patterns", async () => {
    const output = await codeTree({
      path: resolve(FIXTURES_DIR, "project"),
      ignore: ["*.md"],
      parser,
    });
    // README.md should be ignored
    expect(output).not.toContain("README.md");
    expect(output).toMatchSnapshot();
  });

  test("respects depth limit", async () => {
    const output = await codeTree({
      path: resolve(FIXTURES_DIR, "project"),
      depth: 1,
      parser,
    });
    // Should see src/ directory but not files inside
    expect(output).toContain("src/");
    expect(output).not.toContain("index.ts");
    expect(output).toMatchSnapshot();
  });

  test("file mode with symbols and comments", async () => {
    const output = await codeTree({
      path: resolve(FIXTURES_DIR, "sample.ts"),
      symbols: true,
      comments: true,
      parser,
    });
    expect(output).toContain("sample.ts");
    expect(output).toMatchSnapshot();
  });

  test("directory mode respects gitignore", async () => {
    const output = await codeTree({
      path: resolve(FIXTURES_DIR, "project"),
      parser,
    });
    // dist/ is in .gitignore
    expect(output).not.toContain("dist/");
    expect(output).not.toContain("output.js");
  });

  test("parses markdown file correctly", async () => {
    const output = await codeTree({
      path: resolve(FIXTURES_DIR, "sample.md"),
      parser,
    });
    expect(output).toContain("sample.md");
    expect(output).toContain("#"); // Markdown sections
    expect(output).toMatchSnapshot();
  });
});
