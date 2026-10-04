#!/usr/bin/env node
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesRoot = join(root, "fixtures");
const NATIVE = new Set(["base-node"]);

function* fixtureDirs() {
  if (!existsSync(fixturesRoot)) return;
  for (const eco of readdirSync(fixturesRoot)) {
    const ecoPath = join(fixturesRoot, eco);
    if (!statSync(ecoPath).isDirectory() || eco.startsWith(".")) continue;
    if (eco.startsWith("base-")) {
      yield { name: eco, dir: ecoPath };
      continue;
    }
    for (const name of readdirSync(ecoPath)) {
      const dir = join(ecoPath, name);
      if (!statSync(dir).isDirectory() || name.startsWith(".")) continue;
      if (!existsSync(join(dir, "package.json"))) continue;
      yield { name, dir };
    }
  }
}

for (const { name, dir } of fixtureDirs()) {
  console.log(`Installing ${name}…`);
  const needsNative = NATIVE.has(name);
  const r = spawnSync(
    "npm",
    ["install", ...(needsNative ? [] : ["--ignore-scripts"]), "--no-audit", "--no-fund"],
    { cwd: dir, stdio: "inherit", shell: process.platform === "win32" },
  );
  if (r.status !== 0) process.exit(r.status ?? 1);
  if (needsNative) {
    spawnSync("npm", ["rebuild", "better-sqlite3", "--no-audit", "--no-fund"], {
      cwd: dir,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
  }
}
console.log("Fixtures ready.");
