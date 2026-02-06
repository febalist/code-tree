#!/usr/bin/env bun

import { defineCommand, runMain } from "citty";
import { z } from "zod";
import { glance } from "./tools/glance.js";

const CliArgsSchema = z
  .object({
    _: z.array(z.string()),
    depth: z.coerce
      .number()
      .pipe(z.int().nonnegative())
      .optional()
      .transform((v) => v ?? null),
    symbols: z
      .boolean()
      .optional()
      .transform((v) => v ?? null),
    comments: z
      .boolean()
      .optional()
      .transform((v) => v ?? null),
    ignore: z
      .union([z.string().transform((s) => [s]), z.array(z.string())])
      .default([]),
  })
  .transform(({ _, ...rest }) => ({
    ...rest,
    paths: _.length > 0 ? _ : ["."],
  }));

const main = defineCommand({
  meta: {
    name: "glance",
    version: "0.1.0",
    description:
      "Scan project structure and extract code symbols (classes, functions, etc.)",
  },
  args: {
    path: {
      type: "positional",
      description: "Paths to directories or files (default: .)",
      required: false,
    },
    depth: {
      type: "string",
      description: "Max directory depth (default: 10)",
    },
    symbols: {
      type: "boolean",
      description: "Include code symbols",
    },
    comments: {
      type: "boolean",
      description: "Include doc comments",
    },
    ignore: {
      type: "string",
      description: "Ignore pattern (repeatable)",
    },
  },
  async run({ args }) {
    const result = CliArgsSchema.safeParse(args);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message).join("; ");
      console.error(`Error: ${messages}`);
      process.exit(1);
    }

    const { paths, depth, symbols, comments, ignore } = result.data;

    const outputs: string[] = [];
    let hasError = false;

    for (const path of paths) {
      try {
        const output = await glance({ path, depth, symbols, comments, ignore });
        outputs.push(output);
      } catch (error) {
        hasError = true;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Error: ${message}`);
      }
    }

    if (outputs.length > 0) {
      console.log(outputs.join("\n\n"));
    }

    if (hasError) {
      process.exit(1);
    }
  },
});

runMain(main);
