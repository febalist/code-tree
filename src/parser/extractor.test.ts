import { beforeAll, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getTestParser } from "../../tests/setup.js";
import type { ParserManager } from "./index.js";

let parser: ParserManager;
let tmpDir: string;

beforeAll(async () => {
  parser = await getTestParser();
  tmpDir = await mkdtemp(join(tmpdir(), "extractor-test-"));
});

describe("extractSymbols", () => {
  test("class with methods hierarchy", async () => {
    const code = `class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}`;
    const testFile = join(tmpDir, "test1.ts");
    await writeFile(testFile, code);

    const result = await parser.parseFile(testFile);
    expect(result).not.toBeNull();
    expect(result?.symbols).toHaveLength(1);
    expect(result?.symbols[0]?.name).toBe("Calculator");
    expect(result?.symbols[0]?.kind).toBe("class");
    expect(result?.symbols[0]?.children).toHaveLength(1);
    expect(result?.symbols[0]?.children?.[0]?.name).toBe("add");
    expect(result?.symbols[0]?.children?.[0]?.kind).toBe("method");

    await rm(testFile);
  });

  test("signature extraction", async () => {
    const code = `function greet(name: string): string {
  return "Hello";
}`;
    const testFile = join(tmpDir, "test2.ts");
    await writeFile(testFile, code);

    const result = await parser.parseFile(testFile);
    expect(result?.symbols).toHaveLength(1);
    expect(result?.symbols[0]?.signature).toContain("function greet");
    expect(result?.symbols[0]?.signature).toContain("name: string");
    expect(result?.symbols[0]?.signature).toContain(": string");

    await rm(testFile);
  });

  test("docblock extraction", async () => {
    const code = `/** Greets a person */
function greet(name: string): string {
  return "Hello";
}`;
    const testFile = join(tmpDir, "test3.ts");
    await writeFile(testFile, code);

    const result = await parser.parseFile(testFile);
    expect(result?.symbols).toHaveLength(1);
    expect(result?.symbols[0]?.docblock).toBe("Greets a person");

    await rm(testFile);
  });

  test("visibility detection for export", async () => {
    const code = "export function greet(): void {}";
    const testFile = join(tmpDir, "test4.ts");
    await writeFile(testFile, code);

    const result = await parser.parseFile(testFile);
    expect(result?.symbols).toHaveLength(1);
    expect(result?.symbols[0]?.name).toBe("greet");

    await rm(testFile);
  });

  test("visibility detection for public/private in class", async () => {
    const code = `class Test {
  public foo() {}
  private bar() {}
}`;
    const testFile = join(tmpDir, "test5.ts");
    await writeFile(testFile, code);

    const result = await parser.parseFile(testFile);
    expect(result?.symbols[0]?.children?.[0]?.visibility).toBe("public");
    expect(result?.symbols[0]?.children?.[1]?.visibility).toBe("private");

    await rm(testFile);
  });

  test("sorting by line number", async () => {
    const code = `function third() {}
function first() {}
function second() {}`;
    const testFile = join(tmpDir, "test6.ts");
    await writeFile(testFile, code);

    const result = await parser.parseFile(testFile);
    expect(result?.symbols).toHaveLength(3);
    expect(result?.symbols[0]?.line).toBe(1);
    expect(result?.symbols[1]?.line).toBe(2);
    expect(result?.symbols[2]?.line).toBe(3);

    await rm(testFile);
  });

  test("signature truncation at 200 chars", async () => {
    const longParams = Array(20)
      .fill(0)
      .map((_, i) => `param${i}: string`)
      .join(", ");
    const code = `function longSignature(${longParams}): void {}`;
    const testFile = join(tmpDir, "test7.ts");
    await writeFile(testFile, code);

    const result = await parser.parseFile(testFile);
    expect(result?.symbols).toHaveLength(1);
    expect(result?.symbols[0]?.signature?.length).toBeLessThanOrEqual(200);

    await rm(testFile);
  });
});
