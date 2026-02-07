import { beforeAll, describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { getTestParser } from "../../../tests/setup.js";
import type { ParserManager } from "../index.js";

const FIXTURES_DIR = resolve(import.meta.dir, "../../../tests/fixtures");

let parser: ParserManager;

beforeAll(async () => {
  parser = await getTestParser();
});

describe("language parsing", () => {
  test.each([
    ["sample.ts", "typescript"],
    ["sample.js", "javascript"],
    ["sample.py", "python"],
    ["sample.go", "go"],
    ["sample.rs", "rust"],
    ["sample.java", "java"],
    ["sample.cs", "csharp"],
    ["sample.rb", "ruby"],
    ["sample.c", "c"],
    ["sample.php", "php"],
    ["sample.md", "markdown"],
  ])("parses %s (%s)", async (file, _lang) => {
    const result = await parser.parseFile(resolve(FIXTURES_DIR, file));
    expect(result).not.toBeNull();
    expect(result?.symbols.length).toBeGreaterThan(0);
    expect(result?.symbols).toMatchSnapshot();
  });
});
