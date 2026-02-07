#!/usr/bin/env bun

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import pkg from "../package.json" with { type: "json" };
import { ParserManager } from "./parser/index.js";
import { codeTree } from "./tools/code-tree.js";

// Shared parser instance for reuse across tool calls
let parser: ParserManager | null = null;

async function getParser(): Promise<ParserManager> {
  if (!parser) {
    parser = new ParserManager();
    await parser.init();
  }
  return parser;
}

const server = new McpServer(
  {
    name: pkg.name,
    version: pkg.version,
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Register the code_tree tool using v1 SDK API
server.tool(
  "code_tree",
  "Scan project structure and extract code symbols (classes, functions, interfaces, etc.) using Tree-sitter AST parsing. Use this tool to understand overall project architecture, find where specific functionality is implemented, locate models/handlers/utilities/etc, or get a quick overview. Supports TypeScript, JavaScript, Python, Go, PHP, Rust, Java, C#, Ruby, Kotlin, Swift, C/C++, and Markdown.",
  {
    path: z
      .string()
      .describe("Path to a file or directory to scan (relative or absolute)"),
    depth: z
      .number()
      .optional()
      .nullable()
      .describe("Maximum directory depth to scan (default: 10)."),
    symbols: z
      .boolean()
      .optional()
      .nullable()
      .describe("Include code symbols in output (default: true)."),
    comments: z
      .boolean()
      .optional()
      .nullable()
      .describe(
        "Include documentation comments (default: auto-detected based on output size)",
      ),
    ignore: z
      .array(z.string())
      .optional()
      .describe('Additional ignore patterns (e.g., ["*.test.ts", "build/**"])'),
  },
  async (args) => {
    try {
      const parserInstance = await getParser();

      const output = await codeTree({
        path: args.path,
        depth: args.depth,
        symbols: args.symbols,
        comments: args.comments,
        ignore: args.ignore,
        parser: parserInstance,
      });

      return {
        content: [
          {
            type: "text",
            text: output,
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${message}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// Connect to stdio transport and start server
const transport = new StdioServerTransport();
await server.connect(transport);
