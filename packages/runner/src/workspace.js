import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { runProcess } from "./process.js";

const IGNORE_ON_COPY = new Set(["node_modules", ".git", "dist", "build", ".next"]);

export function createWorkspace({ fixturePath, workspacesRoot, runId, caseId, keep = false }) {
  const dest = join(workspacesRoot, runId, caseId);
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
  mkdirSync(dirname(dest), { recursive: true });
  copyFixture(fixturePath, dest);
  linkFixtureNodeModules(fixturePath, dest);
  return {
    path: dest,
    cleanup() {
      if (!keep && existsSync(dest)) rmSync(dest, { recursive: true, force: true });
    },
  };
}

function copyFixture(src, dest) {
  cpSync(src, dest, {
    recursive: true,
    filter: (source) => {
      const base = source.split(/[/\\]/).pop();
      return !IGNORE_ON_COPY.has(base);
    },
  });
}

export function linkFixtureNodeModules(fixturePath, workspacePath) {
  const nm = join(fixturePath, "node_modules");
  const dest = join(workspacePath, "node_modules");
  if (!existsSync(nm) || existsSync(dest)) return;
  try {
    symlinkSync(nm, dest, "junction");
  } catch {
    // dry-run file checks may still work without deps
  }
}

/**
 * When a case declares extra packages (or solution rewrote package.json),
 * replace the fixture node_modules symlink with a real install in the workspace.
 */
export async function ensureWorkspacePackages(workspacePath, task, fixturePath) {
  const declared = Array.isArray(task?.packages) ? task.packages.filter(Boolean) : [];
  const pkgPath = join(workspacePath, "package.json");
  const fixturePkgPath = join(fixturePath ?? task?.fixturePath ?? "", "package.json");
  let packageJsonChanged = false;
  if (existsSync(pkgPath) && existsSync(fixturePkgPath)) {
    packageJsonChanged =
      readFileSync(pkgPath, "utf8") !== readFileSync(fixturePkgPath, "utf8");
  } else if (existsSync(pkgPath) && !existsSync(fixturePkgPath)) {
    packageJsonChanged = true;
  }
  if (declared.length === 0 && !packageJsonChanged) {
    return { method: "skipped", installed: false };
  }

  const nm = join(workspacePath, "node_modules");
  if (existsSync(nm)) {
    try {
      const st = lstatSync(nm);
      if (st.isSymbolicLink()) unlinkSync(nm);
      else rmSync(nm, { recursive: true, force: true });
    } catch {
      // continue; npm install may still succeed
    }
  }

  const execution = await runProcess({
    command: "npm install --no-fund --no-audit",
    cwd: workspacePath,
    timeoutMs: 300000,
    shell: true,
    env: { CI: "1", npm_config_fund: "false", npm_config_audit: "false" },
  });
  if (execution.exitCode !== 0) {
    throw new Error(
      `npm install failed in workspace (exit ${execution.exitCode}): ${String(execution.stderr || execution.stdout).slice(0, 800)}`,
    );
  }
  return { method: "npm-install", installed: true, durationMs: execution.durationMs };
}

export async function applyPatch(workspace, patchPath) {
  if (!existsSync(patchPath)) {
    throw new Error(`solution.patch not found: ${patchPath}`);
  }

  for (const args of [
    ["apply", "--unsafe-paths", "-p0", patchPath],
    ["apply", "--unsafe-paths", "-p1", patchPath],
  ]) {
    const git = await runProcess({
      command: "git",
      args,
      cwd: workspace,
      timeoutMs: 15000,
    });
    if (git.exitCode === 0) return { method: `git-${args[2]}` };
  }

  const patch = readFileSync(patchPath, "utf8");
  applyUnifiedDiff(workspace, patch);
  return { method: "builtin" };
}

function applyUnifiedDiff(workspace, patch) {
  const files = splitDiffFiles(patch);
  if (files.length === 0) throw new Error("Empty or unsupported patch");
  for (const file of files) {
    const target = join(workspace, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.newContent, "utf8");
  }
}

function splitDiffFiles(patch) {
  const chunks = patch.split(/^diff --git /m).filter(Boolean);
  const out = [];
  for (const chunk of chunks) {
    const text = chunk.startsWith("a/") || chunk.startsWith("b/") ? `diff --git ${chunk}` : chunk;
    const pathMatch = text.match(/\+\+\+ [ab]\/(.+)/);
    if (!pathMatch) continue;
    const path = pathMatch[1].trim();
    const isNew = /new file mode/.test(text) || /--- \/dev\/null/.test(text);
    const lines = text.split(/\r?\n/);
    const newLines = [];
    let inHunk = false;
    for (const line of lines) {
      if (line.startsWith("@@")) {
        inHunk = true;
        continue;
      }
      if (!inHunk) continue;
      if (line.startsWith("+") && !line.startsWith("+++")) newLines.push(line.slice(1));
      else if (line.startsWith("-") && !line.startsWith("---")) continue;
      else if (line.startsWith("\\")) continue;
      else newLines.push(line.startsWith(" ") ? line.slice(1) : line);
    }
    out.push({ path, isNew, newContent: `${newLines.join("\n")}\n` });
  }
  return out;
}
