import { z } from "zod";

export const DepthOptionSchema = z.union([
  z.number().int().nonnegative(),
  z
    .string()
    .trim()
    .regex(/^[0-9]+$/)
    .transform((value) => Number(value)),
]);

export const BooleanOptionSchema = z.union([z.boolean(), z.stringbool()]);
