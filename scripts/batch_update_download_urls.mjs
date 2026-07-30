#!/usr/bin/env node
// 批量把 D1 download_links 表中所有 url 列更新为 UNIFIED_DOWNLOAD_URL。
// 默认目标 --remote,需要 wrangler 环境配置 + CLOUDFLARE_API_TOKEN。

import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

import { UNIFIED_DOWNLOAD_URL } from "../lib/unified-download.mjs";

async function runWrangler(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/run_wrangler_local.mjs", ...args], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        WRANGLER_FORCE_NONINTERACTIVE: "1",
      },
    });
    let out = "", err = "";
    child.stdout?.on("data", c => out += c);
    child.stderr?.on("data", c => err += c);
    child.on("exit", code => code === 0 ? resolve({ out, err }) : reject(new Error(`wrangler exit ${code}: ${err || out}`)));
    child.on("error", reject);
  });
}

const target = process.argv.includes("--local") ? "--local" : "--remote";

// 先 dry-run 展示 SQL,再真正执行。
const statements = [
  // 空字符串或 '0' 之类空链接也归一为统一URL
  `UPDATE download_links SET url = '${UNIFIED_DOWNLOAD_URL}', name = '夸克网盘', provider = 'quark' WHERE url IS NULL OR url = '' OR url = '0';`,
  // 其他不是统一URL的全替换
  `UPDATE download_links SET url = '${UNIFIED_DOWNLOAD_URL}', name = '夸克网盘', provider = 'quark' WHERE url != '${UNIFIED_DOWNLOAD_URL}';`,
];
const sql = statements.join("\n\n");
console.log("--- generated SQL ---");
console.log(sql);
console.log("--- end SQL ---");

const tmp = await mkdtemp(path.join(os.tmpdir(), "qifeibook-batch-"));
const sqlFile = path.join(tmp, "batch.sql");
try {
  await writeFile(sqlFile, sql, "utf8");
  const result = await runWrangler(["d1", "execute", "qifeibook", target, "--file", sqlFile]);
  console.log("--- wrangler stdout ---");
  console.log(result.out);
  if (result.err) console.log("--- wrangler stderr ---\n" + result.err);
} finally {
  await rm(tmp, { recursive: true, force: true });
}
