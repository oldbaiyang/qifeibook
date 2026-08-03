// Fix a single book: update cover, year, authorDetail, description.
import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

function parseArgs(argv) {
  const args = { id: 0, remote: false, local: false, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--id") {
      args.id = Number(argv[++i] ?? 0);
    } else if (a === "--remote") {
      args.remote = true;
    } else if (a === "--local") {
      args.local = true;
    } else if (a === "--dry-run") {
      args.dryRun = true;
    } else if (a === "--cover") {
      args.cover = argv[++i] ?? "";
    } else if (a === "--year") {
      args.year = argv[++i] ?? "";
    } else if (a === "--publish-year") {
      args.publishYear = argv[++i] ?? "";
    } else if (a === "--author-detail") {
      args.authorDetail = argv[++i] ?? "";
    } else if (a === "--description") {
      args.description = argv[++i] ?? "";
    } else {
      throw new Error(`Unknown argument: ${a}`);
    }
  }
  if (!args.id) throw new Error("Provide --id");
  if (!args.dryRun && args.remote === args.local) {
    throw new Error("Choose --remote or --local");
  }
  return args;
}

function escapeSql(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function buildSql(args) {
  const sets = [];
  if (args.cover) sets.push(`cover = ${escapeSql(args.cover)}`);
  if (args.year) sets.push(`year = ${escapeSql(args.year)}`);
  if (args.publishYear) sets.push(`publish_year = ${escapeSql(args.publishYear)}`);
  if (args.authorDetail) sets.push(`author_detail = ${escapeSql(args.authorDetail)}`);
  if (args.description) sets.push(`description = ${escapeSql(args.description)}`);
  sets.push(`updated_at = datetime('now')`);
  if (sets.length === 1) {
    throw new Error("No fields to update");
  }
  return [
    `-- Fix book ${args.id}`,
    "PRAGMA foreign_keys = ON;",
    `UPDATE books SET ${sets.join(", ")} WHERE id = ${args.id};`,
    "",
    "INSERT INTO books_fts(books_fts) VALUES('delete-all');",
    "INSERT INTO books_fts (rowid, title, author, description, keywords) SELECT id, title, author, description, COALESCE(keywords_json, '') FROM books;",
    "",
  ].join("\n");
}

function runWrangler(args) {
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
  const sql = buildSql(args);
  if (args.dryRun) {
    console.log(sql);
    return;
  }
  const target = args.remote ? "--remote" : "--local";
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "qifeibook-fix-"));
  const sqlFile = path.join(tempDir, "fix-book.sql");
  try {
    await writeFile(sqlFile, sql, "utf8");
    console.log(`Fixing book ${args.id} on D1 (${args.remote ? "remote" : "local"})...`);
    await runWrangler(["d1", "execute", "qifeibook", target, "--file", sqlFile], sql);
    console.log(`Fixed book ${args.id}.`);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
