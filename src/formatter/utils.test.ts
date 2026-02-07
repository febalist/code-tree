import { describe, expect, test } from "bun:test";
import { getKindPrefix } from "./utils.js";

describe("getKindPrefix", () => {
  test("function -> fn", () => {
    expect(getKindPrefix("function")).toBe("fn");
  });

  test("method -> fn", () => {
    expect(getKindPrefix("method")).toBe("fn");
  });

  test("class -> class", () => {
    expect(getKindPrefix("class")).toBe("class");
  });

  test("interface -> interface", () => {
    expect(getKindPrefix("interface")).toBe("interface");
  });

  test("type -> type", () => {
    expect(getKindPrefix("type")).toBe("type");
  });

  test("enum -> enum", () => {
    expect(getKindPrefix("enum")).toBe("enum");
  });

  test("struct -> struct", () => {
    expect(getKindPrefix("struct")).toBe("struct");
  });

  test("trait -> trait", () => {
    expect(getKindPrefix("trait")).toBe("trait");
  });

  test("namespace -> namespace", () => {
    expect(getKindPrefix("namespace")).toBe("namespace");
  });

  test("module -> namespace", () => {
    expect(getKindPrefix("module")).toBe("namespace");
  });

  test("constant -> const", () => {
    expect(getKindPrefix("constant")).toBe("const");
  });

  test("package -> package", () => {
    expect(getKindPrefix("package")).toBe("package");
  });

  test("section -> #", () => {
    expect(getKindPrefix("section")).toBe("#");
  });

  test("unknown kind falls through to kind itself", () => {
    // biome-ignore lint/suspicious/noExplicitAny: testing fallback behavior
    expect(getKindPrefix("something" as any)).toBe("something");
  });
});
