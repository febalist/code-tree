import { readFile } from "node:fs/promises";
import { join } from "node:path";
import ignore from "ignore";

const HARDCODED_IGNORES = [".*/", ".DS_Store"];

const DEFAULT_IGNORES = [
  "node_modules",
  "vendor",
  "__pycache__",
  "venv",
  "dist",
  "build",
  "target",
  "bin",
  "obj",
  "coverage",
];

export class IgnoreManager {
  private ig = ignore();
  private gitignoreLoaded = false;

  constructor(
    private rootPath: string,
    customPatterns: string[] = [],
  ) {
    // Add hardcoded and default ignores
    this.ig.add([...HARDCODED_IGNORES, ...DEFAULT_IGNORES, ...customPatterns]);
  }

  async loadGitignore() {
    if (this.gitignoreLoaded) return;

    try {
      const gitignorePath = join(this.rootPath, ".gitignore");
      const content = await readFile(gitignorePath, "utf-8");
      const patterns = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"));
      this.ig.add(patterns);
      this.gitignoreLoaded = true;
    } catch {
      // .gitignore not found or not readable, continue without it
    }
  }

  shouldIgnore(relativePath: string): boolean {
    return this.ig.ignores(relativePath);
  }
}
