#!/usr/bin/env bun

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod";
import { glance } from "./tools/glance.js";

const server = new McpServer({
  name: "glance-mcp",
  version: "0.1.0",
});

// Register glance tool
server.tool(
  "glance",
  "Scan project structure and extract code symbols (classes, functions, etc.)",
  {
    path: z.string().describe("Path to directory or file"),
    depth: z.number().optional().describe("Max directory depth (default: 10)"),
    symbols: z
      .boolean()
      .optional()
      .describe("Include code symbols (default: auto)"),
    comments: z
      .boolean()
      .optional()
      .describe("Include doc comments (default: auto)"),
    ignore: z
      .array(z.string())
      .optional()
      .describe("Additional ignore patterns"),
  },
  async ({ path, depth, symbols, comments, ignore }) => {
    try {
      const result = await glance({
        path,
        depth: depth ?? null,
        symbols: symbols ?? null,
        comments: comments ?? null,
        ignore: ignore ?? [],
      });

      return {
        content: [{ type: "text", text: result }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  },
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
