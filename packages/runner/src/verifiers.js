import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import Database from "better-sqlite3";
import { parse as parseYaml } from "yaml";
import { runHttpCheck } from "./http-check.js";
import { runProcess } from "./process.js";
import { diffSnapshots } from "./snapshot.js";

export async function verifyCheck(check, context) {
  try {
    const result = await verify(check, context);
    return { type: check.type, ...result };
  } catch (error) {
    return { type: check.type, passed: false, details: error.message };
  }
}

async function verify(check, context) {
  const { output, agentExitCode, workspace, before, after } = context;
  if (check.type === "agent_exit") {
    return result(agentExitCode === check.equals, `exit ${agentExitCode}`);
  }
  if (check.type === "output_not_empty") {
    return result(output.trim().length > 0, `${output.trim().length} characters`);
  }
  if (check.type === "file_exists") {
    return result(existsSync(join(workspace, check.path)));
  }
  if (check.type === "file_not_exists") {
    return result(!existsSync(join(workspace, check.path)));
  }
  if (check.type === "file_contains" || check.type === "file_not_contains") {
    const path = join(workspace, check.path);
    const contains = existsSync(path) && readFileSync(path, "utf8").includes(check.value);
    return result(check.type === "file_contains" ? contains : !contains);
  }
  if (check.type === "file_contains_any") {
    const paths = check.paths ?? (check.path ? [check.path] : []);
    const hit = paths.find(
      (relative) =>
        existsSync(join(workspace, relative)) &&
        readFileSync(join(workspace, relative), "utf8").includes(check.value),
    );
    return result(Boolean(hit), hit ? `matched ${hit}` : `none of: ${paths.join(", ")}`);
  }
  if (check.type === "dir_has_files") {
    const path = join(workspace, check.path);
    const count = existsSync(path)
      ? readdirSync(path).filter((entry) => statSync(join(path, entry)).isFile()).length
      : 0;
    return result(count >= (check.minimum ?? 1), `${count} files`);
  }
  if (check.type === "workspace_unchanged") {
    const changed = diffSnapshots(before, after);
    return result(changed.length === 0, changed.join(", "));
  }
  if (check.type === "workspace_changed") {
    const changed = diffSnapshots(before, after);
    return result(changed.length > 0, changed.join(", "));
  }
  if (check.type === "command") {
    const execution = await runProcess({
      command: check.command,
      cwd: workspace,
      timeoutMs: check.timeoutMs ?? 120000,
      shell: true,
      env: { CI: "1", NEXT_TELEMETRY_DISABLED: "1" },
    });
    const passed =
      execution.exitCode === (check.exitCode ?? 0) &&
      (!check.stdoutContains || execution.stdout.includes(check.stdoutContains));
    return result(passed, formatCommandCheckDetails(check.command, execution), {
      timedOut: Boolean(execution.timedOut),
      durationMs: execution.durationMs,
    });
  }
  if (check.type === "http") {
    return runHttpCheck(check, workspace);
  }
  if (check.type === "package_deps") {
    return runPackageDepsCheck(check, workspace);
  }
  if (check.type === "sqlite_query") {
    return runSqliteQueryCheck(check, workspace);
  }
  if (check.type === "workflow_yaml_valid") {
    return runWorkflowYamlCheck(check, workspace);
  }
  return result(false, `Unsupported check type: ${check.type}`);
}

function runPackageDepsCheck(check, workspace) {
  const rel = check.file ?? "package.json";
  const path = join(workspace, rel);
  if (!existsSync(path)) return result(false, `${rel} not found`);
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    return result(false, `invalid package.json: ${error.message}`);
  }
  const deps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
    ...(pkg.optionalDependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
  };
  const missing = (check.packages ?? []).filter((name) => !(name in deps));
  return result(
    missing.length === 0,
    missing.length ? `missing: ${missing.join(", ")}` : `ok: ${(check.packages ?? []).join(", ")}`,
  );
}

function runSqliteQueryCheck(check, workspace) {
  const dbPath = join(workspace, check.dbPath);
  if (!existsSync(dbPath)) return result(false, `sqlite db not found: ${check.dbPath}`);
  const db = new Database(dbPath, { readonly: true });
  try {
    const rows = db.prepare(check.sql).all();
    const row = rows[check.row ?? 0];
    const actual = row ? row[check.column] : undefined;
    if (check.equals !== undefined) {
      return result(
        row !== undefined && String(actual) === String(check.equals),
        `row ${check.row ?? 0}.${check.column} = ${actual}`,
      );
    }
    if (check.minimum !== undefined) {
      return result(
        row !== undefined && Number(actual) >= check.minimum,
        `row ${check.row ?? 0}.${check.column} = ${actual}`,
      );
    }
    return result(rows.length > 0, `${rows.length} rows`);
  } finally {
    db.close();
  }
}

function runWorkflowYamlCheck(check, workspace) {
  const path = join(workspace, check.path);
  if (!existsSync(path)) return result(false, `workflow file not found: ${check.path}`);
  let parsed;
  try {
    parsed = parseYaml(readFileSync(path, "utf8"));
  } catch (error) {
    return result(false, `invalid YAML: ${error.message}`);
  }
  const jobs = Object.keys(parsed?.jobs ?? {});
  const triggers = normalizeWorkflowTriggers(parsed?.on);
  const missingJobs = (check.requireJobs ?? []).filter((job) => !jobs.includes(job));
  const missingTriggers = (check.requireTriggers ?? []).filter((t) => !triggers.includes(t));
  const passed = missingJobs.length === 0 && missingTriggers.length === 0;
  return result(
    passed,
    `jobs=${jobs.join(",")} triggers=${triggers.join(",")}`,
  );
}

function normalizeWorkflowTriggers(on) {
  if (!on) return [];
  if (typeof on === "string") return [on];
  if (Array.isArray(on)) return on;
  if (typeof on === "object") return Object.keys(on);
  return [];
}

export function formatCommandCheckDetails(command, execution) {
  const status = execution.timedOut
    ? `TIMED OUT after ${execution.durationMs}ms (exit ${execution.exitCode})`
    : `exit ${execution.exitCode} in ${execution.durationMs}ms`;
  const stdout = String(execution.stdout ?? "").trim();
  const stderr = String(execution.stderr ?? "").trim();
  const body = (stderr || stdout).trim();
  return `${command} -> ${status}\n${body.slice(0, 1500)}`;
}

function result(passed, details = "", extra = {}) {
  return { passed, details, ...extra };
}
