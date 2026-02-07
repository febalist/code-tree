import { ParserManager } from "../src/parser/index.js";
import "../src/parser/queries/index.js"; // Register all languages

let sharedParser: ParserManager | null = null;

export async function getTestParser(): Promise<ParserManager> {
  if (!sharedParser) {
    sharedParser = new ParserManager();
    await sharedParser.init();
  }
  return sharedParser;
}
