import { describe, expect, test } from "bun:test";
import { BooleanOptionSchema, DepthOptionSchema } from "./options.js";

describe("DepthOptionSchema", () => {
  test("accepts zero", () => {
    expect(DepthOptionSchema.parse(0)).toBe(0);
  });

  test("accepts positive integer", () => {
    expect(DepthOptionSchema.parse(5)).toBe(5);
  });

  test("accepts numeric string", () => {
    expect(DepthOptionSchema.parse("10")).toBe(10);
  });

  test("accepts zero as string", () => {
    expect(DepthOptionSchema.parse("0")).toBe(0);
  });

  test("trims whitespace from string", () => {
    expect(DepthOptionSchema.parse("  3  ")).toBe(3);
  });

  test("rejects negative number", () => {
    expect(() => DepthOptionSchema.parse(-1)).toThrow();
  });

  test("rejects float", () => {
    expect(() => DepthOptionSchema.parse(1.5)).toThrow();
  });

  test("rejects empty string", () => {
    expect(() => DepthOptionSchema.parse("")).toThrow();
  });

  test("rejects non-numeric string", () => {
    expect(() => DepthOptionSchema.parse("abc")).toThrow();
  });

  test("rejects negative string", () => {
    expect(() => DepthOptionSchema.parse("-1")).toThrow();
  });

  test("rejects float string", () => {
    expect(() => DepthOptionSchema.parse("1.5")).toThrow();
  });
});

describe("BooleanOptionSchema", () => {
  test("accepts true", () => {
    expect(BooleanOptionSchema.parse(true)).toBe(true);
  });

  test("accepts false", () => {
    expect(BooleanOptionSchema.parse(false)).toBe(false);
  });

  test('accepts "true" string', () => {
    expect(BooleanOptionSchema.parse("true")).toBe(true);
  });

  test('accepts "false" string', () => {
    expect(BooleanOptionSchema.parse("false")).toBe(false);
  });

  test('accepts "1" string', () => {
    expect(BooleanOptionSchema.parse("1")).toBe(true);
  });

  test('accepts "0" string', () => {
    expect(BooleanOptionSchema.parse("0")).toBe(false);
  });

  test('accepts "yes" string', () => {
    expect(BooleanOptionSchema.parse("yes")).toBe(true);
  });

  test('accepts "no" string', () => {
    expect(BooleanOptionSchema.parse("no")).toBe(false);
  });

  test("rejects number", () => {
    expect(() => BooleanOptionSchema.parse(123)).toThrow();
  });

  test("rejects unrecognized string", () => {
    expect(() => BooleanOptionSchema.parse("maybe")).toThrow();
  });
});
