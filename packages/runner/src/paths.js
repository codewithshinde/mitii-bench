import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/** Repo root: mitii-bench/ */
export function repoRoot(cwd = process.cwd()) {
  let dir = resolve(cwd);
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, "pnpm-workspace.yaml")) && existsSync(join(dir, "suites"))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fallback: packages/runner/src -> ../../..
  return resolve(here, "../../..");
}

export function fixturesDir(root = repoRoot()) {
  return join(root, "fixtures");
}

export function suitesDir(root = repoRoot()) {
  return join(root, "suites");
}

export function catalogPath(root = repoRoot()) {
  return join(root, "catalog", "catalog.json");
}

export function workspacesDir(root = repoRoot()) {
  return join(root, ".workspaces");
}

export function reportsDir(root = repoRoot()) {
  return join(root, "reports");
}
