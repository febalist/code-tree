import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { IgnoreManager } from "./ignore.js";

describe("IgnoreManager", () => {
  test("ignores dot directories by default", () => {
    const im = new IgnoreManager("/tmp/test");
    expect(im.shouldIgnore(".git/")).toBe(true);
    expect(im.shouldIgnore(".github/")).toBe(true);
    expect(im.shouldIgnore(".DS_Store")).toBe(true);
  });

  test("ignores default directories", () => {
    const im = new IgnoreManager("/tmp/test");
    expect(im.shouldIgnore("node_modules/")).toBe(true);
    expect(im.shouldIgnore("dist/")).toBe(true);
    expect(im.shouldIgnore("build/")).toBe(true);
    expect(im.shouldIgnore("vendor/")).toBe(true);
    expect(im.shouldIgnore("__pycache__/")).toBe(true);
    expect(im.shouldIgnore("venv/")).toBe(true);
    expect(im.shouldIgnore("target/")).toBe(true);
  });

  test("does not ignore regular files", () => {
    const im = new IgnoreManager("/tmp/test");
    expect(im.shouldIgnore("src/index.ts")).toBe(false);
    expect(im.shouldIgnore("README.md")).toBe(false);
  });

  test("respects custom patterns", () => {
    const im = new IgnoreManager("/tmp/test", ["*.test.ts", "temp/"]);
    expect(im.shouldIgnore("foo.test.ts")).toBe(true);
    expect(im.shouldIgnore("temp/")).toBe(true);
    expect(im.shouldIgnore("foo.ts")).toBe(false);
  });

  describe("loadGitignore", () => {
    let tmpDir: string;

    beforeAll(async () => {
      tmpDir = await mkdtemp(join(tmpdir(), "ignore-test-"));
      await writeFile(join(tmpDir, ".gitignore"), "*.log\noutput/\n");
    });

    afterAll(async () => {
      await rm(tmpDir, { recursive: true });
    });

    test("loads patterns from .gitignore", async () => {
      const im = new IgnoreManager(tmpDir);
      await im.loadGitignore();
      expect(im.shouldIgnore("debug.log")).toBe(true);
      expect(im.shouldIgnore("output/")).toBe(true);
    });

    test("is idempotent", async () => {
      const im = new IgnoreManager(tmpDir);
      await im.loadGitignore();
      await im.loadGitignore(); // Should not error or double-add
      expect(im.shouldIgnore("debug.log")).toBe(true);
    });

    test("handles missing .gitignore gracefully", async () => {
      const emptyDir = await mkdtemp(join(tmpdir(), "ignore-test-empty-"));
      const im = new IgnoreManager(emptyDir);
      await im.loadGitignore(); // Should not throw
      expect(im.shouldIgnore("node_modules/")).toBe(true); // Still has defaults
      await rm(emptyDir, { recursive: true });
    });
  });

  test("gitignore patterns work with and without trailing slash", async () => {
    const tmpDir = await mkdtemp(join(tmpdir(), "ignore-test-"));
    await writeFile(join(tmpDir, ".gitignore"), "build\n");

    const im = new IgnoreManager(tmpDir);
    await im.loadGitignore();
    expect(im.shouldIgnore("build/")).toBe(true);
    expect(im.shouldIgnore("build")).toBe(true);

    await rm(tmpDir, { recursive: true });
  });
});
