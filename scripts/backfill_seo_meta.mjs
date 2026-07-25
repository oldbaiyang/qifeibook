#!/usr/bin/env node
/**
 * 回填 authors / tags / book_tags 三张 SEO 元数据表。
 *
 * 用法：
 *   node scripts/backfill_seo_meta.mjs --local     # 本地 D1
 *   node scripts/backfill_seo_meta.mjs --remote    # 远端 D1（需 CLOUDFLARE_API_TOKEN）
 *   node scripts/backfill_seo_meta.mjs --dry-run   # 只生成 SQL，不执行
 *
 * 数据流：
 *   books.author -> authors(name, book_count)
 *   books.keywords_json -> book_tags(book_id, tag_name) -> tags(name, book_count)
 *
 * 依赖前置：
 *   - 已经应用 db/migrations/0002_seo_meta.sql
 *   - books.keywords_json 已被 seo:keyword-backfill 填充
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

function parseArgs(argv) {
  const args = { local: false, remote: false, dryRun: false };
  for (const arg of argv) {
    if (arg === "--local") args.local = true;
    else if (arg === "--remote") args.remote = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.dryRun && args.remote === args.local) {
    throw new Error("Choose exactly one target: --local, --remote, or --dry-run.");
  }
  return args;
}

function buildBackfillStatements() {
  return [
    {
      name: "authors",
      sql: `INSERT INTO authors (name, book_count, updated_at)
SELECT
  TRIM(author) AS name,
  COUNT(*) AS book_count,
  datetime('now') AS updated_at
FROM books
WHERE TRIM(author) != ''
GROUP BY TRIM(author)
ON CONFLICT(name) DO UPDATE SET
  book_count = excluded.book_count,
  updated_at = excluded.updated_at;`,
    },
    {
      name: "book_tags",
      sql: `INSERT OR IGNORE INTO book_tags (book_id, tag_name)
SELECT
  b.id AS book_id,
  TRIM(CAST(j.value AS TEXT)) AS tag_name
FROM books b,
  json_each(CASE WHEN json_valid(b.keywords_json) THEN b.keywords_json ELSE '[]' END) j
WHERE TRIM(CAST(j.value AS TEXT)) != '';`,
    },
    {
      name: "tags",
      sql: `INSERT INTO tags (name, book_count, updated_at)
SELECT
  tag_name AS name,
  COUNT(DISTINCT book_id) AS book_count,
  datetime('now') AS updated_at
FROM book_tags
GROUP BY tag_name
ON CONFLICT(name) DO UPDATE SET
  book_count = excluded.book_count,
  updated_at = excluded.updated_at;`,
    },
  ];
}

function runWranglerD1Command(args, sql) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join("scripts", "run_wrangler_local.mjs"), "d1", "execute", "qifeibook", ...args, "--command", sql], {
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
      else reject(new Error(`wrangler d1 execute exited with code ${code}`));
    });
  });
}

const args = parseArgs(process.argv.slice(2));
const statements = buildBackfillStatements();

if (args.dryRun) {
  console.log("--dry-run: SQL statements that would be executed:\n");
  for (const stmt of statements) {
    console.log(`-- ${stmt.name}`);
    console.log(stmt.sql);
    console.log();
  }
} else {
  const target = args.local ? "--local" : "--remote";
  for (const stmt of statements) {
    console.log(`Applying ${stmt.name}...`);
    await runWranglerD1Command([target], stmt.sql);
  }
  console.log("Backfill complete.");
}