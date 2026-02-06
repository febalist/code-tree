#!/usr/bin/env bun

import { defineCommand, runMain } from "citty";
import { glance } from "./tools/glance.js";

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
    // Collect paths: use all positional args, default to current directory
    const paths = args._.length > 0 ? args._ : ["."];

    // Parse depth
    let depth: number | null = null;
    if (args.depth !== undefined) {
      depth = Number.parseInt(args.depth, 10);
      if (Number.isNaN(depth) || depth < 0) {
        console.error(`Error: Invalid depth value: ${args.depth}`);
        process.exit(1);
      }
    }

    // Normalize ignore patterns (repeated --ignore produces array)
    const ignore = Array.isArray(args.ignore)
      ? (args.ignore as string[])
      : args.ignore
        ? [args.ignore]
        : [];

    // Map undefined to null for auto-detection
    const symbols = args.symbols ?? null;
    const comments = args.comments ?? null;

    const outputs: string[] = [];
    let hasError = false;

    for (const path of paths) {
      try {
        const result = await glance({ path, depth, symbols, comments, ignore });
        outputs.push(result);
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
