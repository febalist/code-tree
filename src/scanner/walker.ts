import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { IgnoreManager } from "./ignore.js";

export interface WalkOptions {
  maxDepth: number;
  maxEntries: number;
  ignorePatterns: string[];
}

export interface WalkEntry {
  path: string;
  name: string;
  isDirectory: boolean;
  depth: number;
  children?: WalkEntry[];
}

export interface WalkResult {
  root: WalkEntry;
  truncated: boolean;
  totalEntries: number;
}

export class DirectoryWalker {
  private ignoreManager: IgnoreManager;
  private entryCount = 0;
  private truncated = false;

  constructor(
    private rootPath: string,
    private options: WalkOptions,
  ) {
    this.ignoreManager = new IgnoreManager(rootPath, options.ignorePatterns);
  }

  async walk(): Promise<WalkResult> {
    await this.ignoreManager.loadGitignore();

    const rootStat = await stat(this.rootPath);
    const rootName = this.rootPath.split("/").pop() || this.rootPath;

    const root: WalkEntry = {
      path: this.rootPath,
      name: rootName,
      isDirectory: rootStat.isDirectory(),
      depth: 0,
    };

    if (root.isDirectory) {
      root.children = await this.walkDirectory(this.rootPath, 0);
    }

    return {
      root,
      truncated: this.truncated,
      totalEntries: this.entryCount,
    };
  }

  private async walkDirectory(
    dirPath: string,
    depth: number,
  ): Promise<WalkEntry[]> {
    if (depth >= this.options.maxDepth) {
      return [];
    }

    if (this.entryCount >= this.options.maxEntries) {
      this.truncated = true;
      return [];
    }

    try {
      const entries = await readdir(dirPath, { withFileTypes: true });
      const results: WalkEntry[] = [];

      for (const entry of entries) {
        if (this.entryCount >= this.options.maxEntries) {
          this.truncated = true;
          break;
        }

        const fullPath = join(dirPath, entry.name);
        const relativePath = relative(this.rootPath, fullPath);
        const checkPath = entry.isDirectory() ? `${relativePath}/` : relativePath;

        // Check if should be ignored
        if (this.ignoreManager.shouldIgnore(checkPath)) {
          continue;
        }

        this.entryCount++;

        const walkEntry: WalkEntry = {
          path: fullPath,
          name: entry.name,
          isDirectory: entry.isDirectory(),
          depth: depth + 1,
        };

        if (entry.isDirectory()) {
          walkEntry.children = await this.walkDirectory(fullPath, depth + 1);
        }

        results.push(walkEntry);
      }

      // Sort: directories first, then alphabetically
      return results.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
    } catch (_error) {
      // Permission denied or other errors - skip this directory
      return [];
    }
  }
}
