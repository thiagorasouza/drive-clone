import fs from "node:fs";
import path from "node:path";
import { getPublicPath } from "./helpers.js";

async function showIndex(req, res) {
  const indexPath = path.join(getPublicPath(), "index.html");
  const indexContent = await fs.promises.readFile(indexPath, "utf-8");

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(indexContent);
}

export { showIndex };
