import { describe, expect, test } from "bun:test";
import { extractMarkdownSymbols } from "./markdown.js";

describe("extractMarkdownSymbols", () => {
  test("empty content returns empty array", () => {
    expect(extractMarkdownSymbols("")).toEqual([]);
  });

  test("single H1 heading", () => {
    const result = extractMarkdownSymbols("# Title");
    expect(result).toEqual([
      {
        name: "Title",
        kind: "section",
        line: 1,
      },
    ]);
  });

  test("H1 with H2 children", () => {
    const content = "# Title\n## Sub";
    const result = extractMarkdownSymbols(content);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Title");
    expect(result[0]?.children).toHaveLength(1);
    expect(result[0]?.children?.[0]?.name).toBe("Sub");
  });

  test("H2 without H1 is top-level", () => {
    const result = extractMarkdownSymbols("## Orphan");
    expect(result).toEqual([
      {
        name: "Orphan",
        kind: "section",
        line: 1,
      },
    ]);
  });

  test("multiple H1s reset nesting", () => {
    const content = "# A\n## A1\n# B\n## B1";
    const result = extractMarkdownSymbols(content);
    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe("A");
    expect(result[0]?.children).toHaveLength(1);
    expect(result[0]?.children?.[0]?.name).toBe("A1");
    expect(result[1]?.name).toBe("B");
    expect(result[1]?.children).toHaveLength(1);
    expect(result[1]?.children?.[0]?.name).toBe("B1");
  });

  test("empty heading text is ignored", () => {
    expect(extractMarkdownSymbols("# ")).toEqual([]);
    expect(extractMarkdownSymbols("#   ")).toEqual([]);
  });

  test("H3+ headings are ignored", () => {
    expect(extractMarkdownSymbols("### Deep")).toEqual([]);
    expect(extractMarkdownSymbols("#### Deeper")).toEqual([]);
  });

  test("correct line numbers", () => {
    const content = "Text\n# First\n\n## Second\nMore text\n# Third";
    const result = extractMarkdownSymbols(content);
    expect(result[0]?.line).toBe(2);
    expect(result[0]?.children?.[0]?.line).toBe(4);
    expect(result[1]?.line).toBe(6);
  });

  test("non-heading lines are ignored", () => {
    const content = "Regular text\n# Heading\nMore text";
    const result = extractMarkdownSymbols(content);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Heading");
  });

  test("H2 only becomes H2 with ## prefix not ###", () => {
    const content = "# H1\n## H2\n### H3";
    const result = extractMarkdownSymbols(content);
    expect(result).toHaveLength(1);
    expect(result[0]?.children).toHaveLength(1);
    expect(result[0]?.children?.[0]?.name).toBe("H2");
  });
});
