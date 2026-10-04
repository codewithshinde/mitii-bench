import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { readMitiiSessionMetrics, runMitiiAgent } from "@mitii-bench/adapter-mitii";
import { loadConfig } from "./config.js";
import {
  discoverProjects,
  discoverTasks,
  loadTaskDir,
  parseTaskRef,
} from "./loader.js";
import { repoRoot, reportsDir, workspacesDir } from "./paths.js";
import { diffSnapshots, snapshotTree } from "./snapshot.js";
import { verifyCheck } from "./verifiers.js";
import {
  applyPatch,
  createWorkspace,
  ensureWorkspacePackages,
  linkFixtureNodeModules,
} from "./workspace.js";

export async function dryRunTask(taskIdOrPath, options = {}) {
  const root = repoRoot();
  const task = resolveTask(root, taskIdOrPath);
  const runId = options.runId ?? `dry-${Date.now()}`;
  const ws = createWorkspace({
    fixturePath: task.fixturePath,
    workspacesRoot: workspacesDir(root),
    runId,
    caseId: (task.runId ?? task.id).replaceAll("@", "__"),
    keep: options.keep ?? true,
  });

  try {
    prepareSetup(ws.path, task);
    await applySolution(ws.path, task);
    await ensureWorkspacePackages(ws.path, task, task.fixturePath);
    const before = snapshotTree(ws.path);
    // Solution already applied — snapshot after as "agent work"
    const after = snapshotTree(ws.path);
    // Agent-hidden behavioral oracles (injected only for grading)
    applyOracle(ws.path, task);
    const results = [];
    for (const check of task.checks) {
      // dry-run: treat agent as success
      if (check.type === "agent_exit") {
        results.push({ type: "agent_exit", passed: true, details: "dry-run" });
        continue;
      }
      if (check.type === "workspace_changed") {
        // Compare fixture baseline vs solved workspace instead
        const fixtureSnap = snapshotTree(task.fixturePath);
        const solvedSnap = snapshotTree(ws.path);
        const changed = diffSnapshots(fixtureSnap, solvedSnap).filter(
          (p) =>
            !p.startsWith("node_modules") &&
            !p.startsWith("__bench__") &&
            !p.includes("/__bench__/") &&
            !p.includes("oracle.test.js") &&
            !p.startsWith("package-lock.json"),
        );
        results.push({
          type: "workspace_changed",
          passed: changed.length > 0,
          details: changed.join(", "),
        });
        continue;
      }
      results.push(
        await verifyCheck(check, {
          output: "dry-run",
          agentExitCode: 0,
          workspace: ws.path,
          before,
          after,
        }),
      );
    }
    const passed = results.every((r) => r.passed);
    const report = {
      id: task.runId ?? task.id,
      base: task.base,
      mode: "dry-run",
      passed,
      workspace: ws.path,
      checks: results,
    };
    writeCaseReport(root, runId, report);
    return report;
  } finally {
    if (!options.keep) ws.cleanup();
  }
}

export async function runTask(taskIdOrPath, options = {}) {
  const root = repoRoot();
  const config = loadConfig(root);
  const task = resolveTask(root, taskIdOrPath);
  const runId = options.runId ?? `run-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const ws = createWorkspace({
    fixturePath: task.fixturePath,
    workspacesRoot: workspacesDir(root),
    runId,
    caseId: (task.runId ?? task.id).replaceAll("@", "__"),
    keep: options.keep ?? config.keepWorkspaces,
  });

  prepareSetup(ws.path, task);
  const before = snapshotTree(ws.path);
  let agentResult = { exitCode: 0, stdout: "", stderr: "", durationMs: 0, skipped: false };

  if (!options.skipAgent) {
    agentResult = await runMitiiAgent({
      workspace: ws.path,
      prompt: task.prompt,
      mode: task.agent?.mode ?? "agent",
      timeoutSec: task.timeoutSec ?? config.timeoutSec ?? 300,
      mitiiBin: config.mitiiBin,
      env: config.env ?? {},
    });
  }

  const after = snapshotTree(ws.path);
  await ensureWorkspacePackages(ws.path, task, task.fixturePath);
  // Inject agent-hidden oracles after the agent finishes (never visible during agent work)
  applyOracle(ws.path, task);
  const results = [];
  for (const check of task.checks) {
    results.push(
      await verifyCheck(check, {
        output: `${agentResult.stdout}\n${agentResult.stderr}`,
        agentExitCode: agentResult.exitCode,
        workspace: ws.path,
        before,
        after,
      }),
    );
  }

  const session = options.skipAgent ? null : readMitiiSessionMetrics(ws.path);
  const report = {
    id: task.runId ?? task.id,
    base: task.base,
    mode: options.skipAgent ? "grade-only" : "agent",
    passed: results.every((r) => r.passed),
    agent: {
      exitCode: agentResult.exitCode,
      durationMs: session?.durationMs ?? agentResult.durationMs,
      timedOut: agentResult.timedOut,
      skipped: agentResult.skipped,
      model: session?.model ?? null,
      startTime: session?.startTime ?? null,
      endTime: session?.endTime ?? null,
      inputTokens: session?.inputTokens ?? null,
      outputTokens: session?.outputTokens ?? null,
      totalTokens: session?.totalTokens ?? null,
      modelCalls: session?.modelCalls ?? null,
      toolCalls: session?.toolCalls ?? null,
    },
    workspace: ws.path,
    checks: results,
  };
  writeCaseReport(root, runId, report);
  return report;
}

export async function runProject(projectId, options = {}) {
  const root = repoRoot();
  const projects = discoverProjects(root);
  const project = projects.find((p) => p.projectId === projectId);
  if (!project) throw new Error(`Project not found: ${projectId}`);

  const runId = options.runId ?? `project-${Date.now()}`;
  const startStep = options.stepFrom ?? 1;
  const endStep = options.stepTo ?? project.steps[project.steps.length - 1].step;

  // Cumulative: one workspace, apply each step's solution or agent sequentially
  const first = project.steps[0].task;
  const fixturePath = first.fixturePath;
  const ws = createWorkspace({
    fixturePath,
    workspacesRoot: workspacesDir(root),
    runId,
    caseId: project.projectId,
    keep: true,
  });
  prepareSetup(ws.path, first);

  const stepReports = [];
  for (const step of project.steps) {
    if (step.step < startStep || step.step > endStep) continue;
    prepareSetup(ws.path, step.task);

    if (options.dryRun) {
      await applySolution(ws.path, step.task);
    } else {
      const agentResult = await runMitiiAgent({
        workspace: ws.path,
        prompt: step.task.prompt,
        mode: step.task.agent?.mode ?? "agent",
        timeoutSec: step.task.timeoutSec ?? 300,
        mitiiBin: loadConfig(root).mitiiBin,
      });
      if (agentResult.skipped) {
        // fall back to solution for CI-less environments when --allow-solution-fallback
        if (options.allowSolutionFallback) await applySolution(ws.path, step.task);
      }
    }

    const before = snapshotTree(ws.path);
    const after = before;
    const results = [];
    for (const check of step.task.checks) {
      if (check.type === "agent_exit") {
        results.push({ type: "agent_exit", passed: true, details: "project-step" });
        continue;
      }
      if (check.type === "workspace_changed") {
        results.push({ type: "workspace_changed", passed: true, details: "cumulative" });
        continue;
      }
      results.push(
        await verifyCheck(check, {
          output: "",
          agentExitCode: 0,
          workspace: ws.path,
          before,
          after,
        }),
      );
    }

    // Regression: re-run prior steps' grade (non-workspace checks)
    if (project.cumulative && step.regression !== false) {
      for (const prev of project.steps) {
        if (prev.step >= step.step) break;
        for (const check of prev.task.checks) {
          if (["agent_exit", "workspace_changed", "workspace_unchanged"].includes(check.type)) {
            continue;
          }
          results.push({
            ...(await verifyCheck(check, {
              output: "",
              agentExitCode: 0,
              workspace: ws.path,
              before,
              after,
            })),
            regressionFrom: prev.task.id,
          });
        }
      }
    }

    const report = {
      projectId: project.projectId,
      step: step.step,
      id: step.task.id,
      passed: results.every((r) => r.passed),
      checks: results,
      workspace: ws.path,
    };
    stepReports.push(report);
    writeCaseReport(root, runId, report);
    if (!report.passed && !options.continueOnFail) break;
  }

  return {
    projectId: project.projectId,
    passed: stepReports.every((r) => r.passed),
    steps: stepReports,
  };
}

export async function validateAll(root = repoRoot()) {
  const tasks = discoverTasks(root);
  const errors = [];
  const ids = new Set();
  for (const t of tasks) {
    if (t.error) {
      errors.push({ path: t.relativeDir, error: t.error });
      continue;
    }
    const key = t.runId ?? t.id;
    if (ids.has(key)) errors.push({ path: t.relativeDir, error: `Duplicate run id: ${key}` });
    ids.add(key);
  }
  try {
    discoverProjects(root);
  } catch (error) {
    errors.push({ path: "projects", error: error.message });
  }
  return { ok: errors.length === 0, count: ids.size, errors };
}

function prepareSetup(workspace, task) {
  const mock = task.setup?.mock;
  if (!mock) return;
  const from = join(task.caseDir, "resources", mock);
  if (!existsSync(from)) {
    throw new Error(`setup.mock not found: resources/${mock}`);
  }
  cpSync(from, join(workspace, mock.includes("/") ? mock.split("/").pop() : mock));
}

async function applySolution(workspace, task) {
  const perBase = join(task.caseDir, "resources", "solution", task.base);
  const legacy = join(task.caseDir, "resources", "solution");

  let copyFrom = null;
  if (existsSync(perBase) && statSync(perBase).isDirectory()) {
    copyFrom = perBase;
  } else if (existsSync(legacy) && statSync(legacy).isDirectory()) {
    // Flat solution files live directly under solution/ (not base-* children only)
    const entries = readdirSync(legacy).filter((e) => e !== ".gitkeep");
    const hasFlatFiles = entries.some((e) => statSync(join(legacy, e)).isFile());
    if (hasFlatFiles) copyFrom = legacy;
  }

  if (copyFrom) {
    const copied = copySolutionDir(copyFrom, workspace);
    linkFixtureNodeModules(task.fixturePath, workspace);
    return { method: copied ? "solution-dir" : "noop" };
  }
  if (existsSync(task.solutionPatch)) {
    return applyPatch(workspace, task.solutionPatch);
  }
  return { method: "noop" };
}

/**
 * Copy agent-hidden behavioral oracles into the workspace for grading only.
 * Looks under resources/oracle/<base>/ then resources/oracle/.
 */
function applyOracle(workspace, task) {
  const perBase = join(task.caseDir, "resources", "oracle", task.base);
  const legacy = join(task.caseDir, "resources", "oracle");
  let copyFrom = null;
  if (existsSync(perBase) && statSync(perBase).isDirectory()) {
    copyFrom = perBase;
  } else if (existsSync(legacy) && statSync(legacy).isDirectory()) {
    const entries = readdirSync(legacy).filter((e) => e !== ".gitkeep" && !e.startsWith("base-"));
    if (entries.length > 0) copyFrom = legacy;
  }
  if (!copyFrom) return { method: "noop" };
  const copied = walkCopy(copyFrom, workspace);
  return { method: copied ? "oracle-dir" : "noop" };
}

function copySolutionDir(solutionDir, workspace) {
  return walkCopy(solutionDir, workspace);
}

function walkCopy(src, destRoot, rel = "") {
  let copied = 0;
  for (const entry of readdirSync(src)) {
    if (entry === ".gitkeep") continue;
    const from = join(src, entry);
    const relPath = rel ? `${rel}/${entry}` : entry;
    if (statSync(from).isDirectory()) {
      copied += walkCopy(from, destRoot, relPath);
    } else {
      const to = join(destRoot, relPath);
      mkdirSync(join(to, ".."), { recursive: true });
      cpSync(from, to);
      copied += 1;
    }
  }
  return copied;
}

function resolveTask(root, taskIdOrPath) {
  if (existsSync(join(taskIdOrPath, "task.yaml"))) {
    return loadTaskDir(taskIdOrPath, root);
  }
  const { id, base } = parseTaskRef(taskIdOrPath);
  const tasks = discoverTasks(root, { id, base: base ?? undefined });
  const hit =
    tasks.find((t) => !t.error && (t.runId === taskIdOrPath || t.instanceId === taskIdOrPath)) ||
    tasks.find((t) => !t.error && t.id === id && (!base || t.base === base));
  if (!hit) {
    throw new Error(
      `Task not found: ${taskIdOrPath}${base ? "" : " (hint: use id@base when the case has multiple bases)"}`,
    );
  }
  return hit;
}

function writeCaseReport(root, runId, report) {
  const dir = join(reportsDir(root), "runs", runId, "cases");
  mkdirSync(dir, { recursive: true });
  const name = report.id ?? `step-${report.step}`;
  writeFileSync(join(dir, `${name}.json`), `${JSON.stringify(report, null, 2)}\n`);
  const lines = [
    `# ${name}`,
    "",
    `Passed: **${report.passed}**`,
    "",
    ...formatAgentMarkdown(report.agent),
    "## Checks",
    "",
    ...(report.checks ?? []).map(
      (c) => `- ${c.passed ? "PASS" : "FAIL"} \`${c.type}\`${c.details ? ` — ${c.details}` : ""}`,
    ),
    "",
  ];
  writeFileSync(join(dir, `${name}.md`), lines.join("\n"));
}

function formatAgentMarkdown(agent) {
  if (!agent || agent.skipped) {
    return ["## Agent", "", "_No agent session (dry-run / skipped)._", ""];
  }
  const totalMs = agent.durationMs;
  const totalLabel =
    totalMs == null
      ? "n/a"
      : `${(totalMs / 1000).toFixed(1)}s (${totalMs}ms)`;
  return [
    "## Agent",
    "",
    `| Field | Value |`,
    `| --- | --- |`,
    `| Model | ${agent.model ?? "n/a"} |`,
    `| Start | ${agent.startTime ?? "n/a"} |`,
    `| End | ${agent.endTime ?? "n/a"} |`,
    `| Total time | ${totalLabel} |`,
    `| Input tokens | ${agent.inputTokens ?? "n/a"} |`,
    `| Output tokens | ${agent.outputTokens ?? "n/a"} |`,
    `| Total tokens | ${agent.totalTokens ?? "n/a"} |`,
    "",
  ];
}
