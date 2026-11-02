import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(process.cwd());
const collectJavaScriptFiles = (directory) => {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectJavaScriptFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(fullPath);
  }
  return files;
};

const files = collectJavaScriptFiles(root);
let failed = false;
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    failed = true;
    process.stderr.write(`${file}\n${result.stderr || result.stdout}`);
  }
}
if (failed) process.exit(1);
console.log(`Syntax check passed for ${files.length} JavaScript files.`);
