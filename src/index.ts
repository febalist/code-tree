#!/usr/bin/env bun

import { defineCommand, renderUsage, runMain } from "citty";
import { z } from "zod";
import { codeTree } from "./tools/code-tree.js";

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
    name: "code-tree",
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
      valueHint: "number",
    },
    symbols: {
      type: "boolean",
      description: "Include code symbols (default: auto)",
      negativeDescription: "Exclude code symbols",
    },
    comments: {
      type: "boolean",
      description: "Include doc comments (default: auto)",
      negativeDescription: "Exclude doc comments",
    },
    ignore: {
      type: "string",
      description: "Ignore pattern (repeatable)",
      valueHint: "pattern",
    },
  },
  async run({ args }) {
    const { paths, depth, symbols, comments, ignore } =
      CliArgsSchema.parse(args);

    const outputs: string[] = [];
    let hasError = false;

    for (const path of paths) {
      try {
        const output = await codeTree({
          path,
          depth,
          symbols,
          comments,
          ignore,
        });
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

const noColor = process.env.NO_COLOR === "1" || process.env.TERM === "dumb";

const fmt = {
  bold: (s: string) => (noColor ? s : `\x1B[1m${s}\x1B[22m`),
  underline: (s: string) => (noColor ? s : `\x1B[4m${s}\x1B[24m`),
};

const header = (s: string) => fmt.underline(fmt.bold(s));

async function customShowUsage<
  T extends import("citty").ArgsDef = import("citty").ArgsDef,
>(
  cmd: import("citty").CommandDef<T>,
  parent?: import("citty").CommandDef<T>,
): Promise<void> {
  const usage = (await renderUsage(cmd, parent)).replace("[PATH]", "[PATH...]");

  const sections = [
    usage,
    "",
    header("EXAMPLES"),
    "",
    "  code-tree .                        Scan current directory",
    "  code-tree src/                     Scan specific directory",
    "  code-tree src/index.ts             Parse specific file",
    "  code-tree src/ lib/                Multiple paths",
    "  code-tree --depth 2 .              Limit directory depth",
    "  code-tree --no-symbols .           Directory tree only",
    '  code-tree --ignore "*.test.ts" .   Exclude test files',
    "",
    header("SUPPORTED LANGUAGES"),
    "",
    "  TypeScript, JavaScript, Python, Go, PHP, Rust, Java, C#,",
    "  Ruby, Kotlin, Swift, C/C++",
    "",
  ];

  console.log(sections.join("\n"));
}

runMain(main, { showUsage: customShowUsage });
