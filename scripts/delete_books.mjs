// Delete specific book ids from D1 (books / books_fts / download_links / book_tags),
// rebuild books_fts and re-aggregate categories.book_count.
import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

function parseArgs(argv) {
  const args = { ids: [], remote: false, local: false, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--ids") {
      const raw = argv[++i] ?? "";
      args.ids = raw.split(",").map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n > 0);
    } else if (a === "--remote") {
      args.remote = true;
    } else if (a === "--local") {
      args.local = true;
    } else if (a === "--dry-run") {
      args.dryRun = true;
    } else {
      throw new Error(`Unknown argument: ${a}`);
    }
  }
  if (args.ids.length === 0) throw new Error("Provide --ids <id1,id2,...>");
  if (!args.dryRun && args.remote === args.local) {
    throw new Error("Choose exactly one target: --remote or --local. Use --dry-run to print SQL only.");
  }
  return args;
}

function buildSql(ids) {
  const list = ids.join(",");
  return [
    `-- Delete books ${list} from qifeibook D1`,
    "PRAGMA foreign_keys = ON;",
    "",
    `DELETE FROM book_tags WHERE book_id IN (${list});`,
    `DELETE FROM download_links WHERE book_id IN (${list});`,
    `DELETE FROM books WHERE id IN (${list});`,
    "",
    "INSERT INTO books_fts(books_fts) VALUES('delete-all');",
    "INSERT INTO books_fts (rowid, title, author, description, keywords) SELECT id, title, author, description, COALESCE(keywords_json, '') FROM books;",
    "UPDATE categories SET book_count = (SELECT COUNT(*) FROM books WHERE books.category_id = categories.id);",
    "",
  ].join("\n");
}

function runWrangler(args, sql) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join("scripts", "run_wrangler_local.mjs"), ...args], {
      cwd: projectRoot,
      stdio: "inherit",
      env: {
        ...process.env,
        WRANGLER_FORCE_NONINTERACTIVE: process.env.WRANGLER_FORCE_NONINTERACTIVE || "1",
      },
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`wrangler exited with code ${code}`));
    });
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sql = buildSql(args.ids);
  if (args.dryRun) {
    console.log(sql);
    return;
  }
  const target = args.remote ? "--remote" : "--local";
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "qifeibook-delete-"));
  const sqlFile = path.join(tempDir, "delete-books.sql");
  try {
    await writeFile(sqlFile, sql, "utf8");
    console.log(`Deleting books ${args.ids.join(", ")} from D1 (${args.remote ? "remote" : "local"})...`);
    await runWrangler(["d1", "execute", "qifeibook", target, "--file", sqlFile], sql);
    console.log(`Deleted ${args.ids.length} book(s).`);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
