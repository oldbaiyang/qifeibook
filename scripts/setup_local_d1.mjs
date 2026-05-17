import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const wranglerRunner = resolve(scriptDir, "run_wrangler_local.mjs");
const seedExporter = resolve(scriptDir, "export_books_to_sql.mjs");
const seedFile = resolve(rootDir, "db/seed/books.sql");

function runNodeCommand(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: rootDir,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!existsSync(seedFile)) {
  console.log("未找到 db/seed/books.sql，先自动导出本地种子文件。");
  runNodeCommand([seedExporter]);
}

runNodeCommand([wranglerRunner, "d1", "migrations", "apply", "qifeibook", "--local"]);
runNodeCommand([wranglerRunner, "d1", "execute", "qifeibook", "--local", "--file", seedFile]);

console.log("本地 D1 初始化完成。");
