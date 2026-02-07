import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { DirectoryWalker } from "./walker.js";

const FIXTURES_DIR = resolve(import.meta.dir, "../../tests/fixtures/project");

describe("DirectoryWalker", () => {
  test("walks directory and returns correct structure", async () => {
    const walker = new DirectoryWalker(FIXTURES_DIR, {
      maxDepth: 10,
      maxEntries: 2000,
      ignorePatterns: [],
    });
    const result = await walker.walk();

    expect(result.root.name).toBe("project");
    expect(result.root.isDirectory).toBe(true);
    expect(result.truncated).toBe(false);
    expect(result.totalEntries).toBeGreaterThan(1);
  });

  test("respects maxDepth", async () => {
    const walker = new DirectoryWalker(FIXTURES_DIR, {
      maxDepth: 1,
      maxEntries: 2000,
      ignorePatterns: [],
    });
    const result = await walker.walk();

    // At depth 1, should see children of root but not their children
    const srcDir = result.root.children?.find((c) => c.name === "src");
    expect(srcDir).toBeDefined();
    // Children array exists but is empty (maxDepth prevents recursion)
    expect(srcDir?.children).toEqual([]);
  });

  test("respects maxEntries and sets truncated flag", async () => {
    const walker = new DirectoryWalker(FIXTURES_DIR, {
      maxDepth: 10,
      maxEntries: 2,
      ignorePatterns: [],
    });
    const result = await walker.walk();

    expect(result.truncated).toBe(true);
    expect(result.totalEntries).toBe(2);
  });

  test("sorts directories before files", async () => {
    const walker = new DirectoryWalker(FIXTURES_DIR, {
      maxDepth: 2,
      maxEntries: 2000,
      ignorePatterns: [],
    });
    const result = await walker.walk();

    const children = result.root.children || [];
    const dirs = children.filter((c) => c.isDirectory);
    const files = children.filter((c) => !c.isDirectory);

    // First child that is a directory should come before first file
    if (dirs.length > 0 && files.length > 0) {
      const firstDirIndex = children.indexOf(dirs[0] as (typeof children)[0]);
      const firstFileIndex = children.indexOf(files[0] as (typeof children)[0]);
      expect(firstDirIndex).toBeLessThan(firstFileIndex);
    }
  });

  test("ignores patterns from .gitignore", async () => {
    const walker = new DirectoryWalker(FIXTURES_DIR, {
      maxDepth: 10,
      maxEntries: 2000,
      ignorePatterns: [],
    });
    const result = await walker.walk();

    // dist/ is in .gitignore, should not appear
    const hasDistDir = result.root.children?.some((c) => c.name === "dist");
    expect(hasDistDir).toBe(false);
  });

  test("respects custom ignore patterns", async () => {
    const walker = new DirectoryWalker(FIXTURES_DIR, {
      maxDepth: 10,
      maxEntries: 2000,
      ignorePatterns: ["*.md"],
    });
    const result = await walker.walk();

    // README.md should be ignored
    const hasReadme = result.root.children?.some((c) => c.name === "README.md");
    expect(hasReadme).toBe(false);
  });

  test("returns correct depth for nested entries", async () => {
    const walker = new DirectoryWalker(FIXTURES_DIR, {
      maxDepth: 10,
      maxEntries: 2000,
      ignorePatterns: [],
    });
    const result = await walker.walk();

    expect(result.root.depth).toBe(0);

    const srcDir = result.root.children?.find((c) => c.name === "src");
    expect(srcDir?.depth).toBe(1);

    const nestedFile = srcDir?.children?.find((c) => c.name === "index.ts");
    expect(nestedFile?.depth).toBe(2);
  });

  test("sets correct isDirectory flag", async () => {
    const walker = new DirectoryWalker(FIXTURES_DIR, {
      maxDepth: 10,
      maxEntries: 2000,
      ignorePatterns: [],
    });
    const result = await walker.walk();

    const srcDir = result.root.children?.find((c) => c.name === "src");
    expect(srcDir?.isDirectory).toBe(true);

    const readmeFile = result.root.children?.find(
      (c) => c.name === "README.md",
    );
    expect(readmeFile?.isDirectory).toBe(false);
  });

  test("alphabetically sorts within same type", async () => {
    const walker = new DirectoryWalker(FIXTURES_DIR, {
      maxDepth: 10,
      maxEntries: 2000,
      ignorePatterns: [],
    });
    const result = await walker.walk();

    const srcDir = result.root.children?.find((c) => c.name === "src");
    const files = srcDir?.children?.filter((c) => !c.isDirectory) || [];

    // Files should be alphabetically sorted
    if (files.length > 1) {
      const names = files.map((f) => f.name);
      const sorted = [...names].sort();
      expect(names).toEqual(sorted);
    }
  });
});
