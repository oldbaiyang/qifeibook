import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const stateDir = resolve(rootDir, ".wrangler-state");
const logDir = resolve(stateDir, "logs");
const logFile = resolve(logDir, "wrangler.log");

for (const directory of [stateDir, logDir]) {
  mkdirSync(directory, { recursive: true });
}

const args = process.argv.slice(2);
const command = process.platform === "win32" ? "npx.cmd" : "npx";
const forceNonInteractive = process.env.WRANGLER_FORCE_NONINTERACTIVE === "1";
const child = spawn(command, ["wrangler", ...args], {
  cwd: rootDir,
  stdio: forceNonInteractive ? ["ignore", "pipe", "pipe"] : "inherit",
  env: {
    ...process.env,
    WRANGLER_LOG_PATH: process.env.WRANGLER_LOG_PATH || logFile,
  },
});

if (forceNonInteractive) {
  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);
}

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
