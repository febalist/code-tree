import { beforeAll, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { getTestParser } from "../../tests/setup.js";
import type { ParserManager } from "./index.js";

const FIXTURES_DIR = resolve(import.meta.dir, "../../tests/fixtures");

let parser: ParserManager;

beforeAll(async () => {
  parser = await getTestParser();
});

describe("ParserManager", () => {
  test("init is idempotent", async () => {
    await parser.init();
    await parser.init(); // Should not throw
    expect(true).toBe(true);
  });

  test("parseFile returns null for unsupported extension", async () => {
    const tmpDir = await mkdtemp(join(tmpdir(), "parser-test-"));
    const testFile = join(tmpDir, "test.xyz");
    await writeFile(testFile, "content");

    const result = await parser.parseFile(testFile);
    expect(result).toBeNull();

    await rm(tmpDir, { recursive: true });
  });

  test("parseFile returns null for nonexistent file", async () => {
    const result = await parser.parseFile("/nonexistent/file.ts");
    expect(result).toBeNull();
  });

  test("parseFile returns correct FileSymbols structure", async () => {
    const result = await parser.parseFile(resolve(FIXTURES_DIR, "sample.ts"));
    expect(result).not.toBeNull();
    expect(result?.path).toBe(resolve(FIXTURES_DIR, "sample.ts"));
    expect(result?.language).toBe("typescript");
    expect(Array.isArray(result?.symbols)).toBe(true);
  });

  test("parseFile uses custom extractor for markdown", async () => {
    const result = await parser.parseFile(resolve(FIXTURES_DIR, "sample.md"));
    expect(result).not.toBeNull();
    expect(result?.language).toBe("markdown");
    expect(result?.symbols.length).toBeGreaterThan(0);
    expect(result?.symbols[0]?.kind).toBe("section");
  });

  test("parseFile handles empty file", async () => {
    const tmpDir = await mkdtemp(join(tmpdir(), "parser-test-"));
    const testFile = join(tmpDir, "empty.ts");
    await writeFile(testFile, "");

    const result = await parser.parseFile(testFile);
    // Empty file should still parse, just with no symbols
    expect(result).not.toBeNull();
    expect(result?.symbols).toEqual([]);

    await rm(tmpDir, { recursive: true });
  });

  test("parseFile handles file with only comments", async () => {
    const tmpDir = await mkdtemp(join(tmpdir(), "parser-test-"));
    const testFile = join(tmpDir, "comments.ts");
    await writeFile(testFile, "// Just a comment\n/* Another comment */");

    const result = await parser.parseFile(testFile);
    expect(result).not.toBeNull();
    // No extractable symbols, just comments
    expect(result?.symbols).toEqual([]);

    await rm(tmpDir, { recursive: true });
  });
});
