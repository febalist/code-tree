import { describe, expect, test } from "bun:test";
import {
  getLanguageByExtension,
  languageRegistry,
  registerLanguage,
} from "./languages.js";
import "./queries/index.js"; // Ensure all languages registered

describe("getLanguageByExtension", () => {
  test("returns typescript config for .ts", () => {
    const config = getLanguageByExtension(".ts");
    expect(config).not.toBeNull();
    expect(config?.name).toBe("typescript");
  });

  test("returns null for unknown extension", () => {
    expect(getLanguageByExtension(".xyz")).toBeNull();
  });

  test.each([
    [".ts", "typescript"],
    [".tsx", "typescript"],
    [".js", "javascript"],
    [".jsx", "javascript"],
    [".py", "python"],
    [".go", "go"],
    [".rs", "rust"],
    [".java", "java"],
    [".cs", "csharp"],
    [".rb", "ruby"],
    [".kt", "kotlin"],
    [".swift", "swift"],
    [".c", "c"],
    [".h", "c"],
    [".cpp", "cpp"],
    [".php", "php"],
    [".md", "markdown"],
    [".mdx", "markdown"],
  ])("extension %s resolves to %s", (ext, name) => {
    const config = getLanguageByExtension(ext);
    expect(config).not.toBeNull();
    expect(config?.name).toBe(name);
  });
});

describe("registerLanguage", () => {
  test("registers language for all its extensions", () => {
    registerLanguage({
      name: "test-lang",
      extensions: [".test1", ".test2"],
      docCommentPrefixes: ["//"],
    });
    expect(getLanguageByExtension(".test1")?.name).toBe("test-lang");
    expect(getLanguageByExtension(".test2")?.name).toBe("test-lang");
  });

  test("language appears in registry", () => {
    registerLanguage({
      name: "test-lang-2",
      extensions: [".test3"],
      docCommentPrefixes: ["#"],
    });
    expect(languageRegistry[".test3"]).toBeDefined();
    expect(languageRegistry[".test3"]?.name).toBe("test-lang-2");
  });
});
