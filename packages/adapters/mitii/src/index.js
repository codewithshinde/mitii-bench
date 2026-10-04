import { spawn } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

/**
 * Invoke Mitii CLI against an isolated workspace.
 * Config lives here — not in individual task.yaml files.
 *
 * Current Mitii CLI (unattended agent edits):
 *   mitii agent --cwd <ws> --prompt-file <file> --autonomy apply --origin automation
 * Other modes:
 *   mitii <mode> --cwd <ws> --prompt-file <file> --origin automation
 */
export async function runMitiiAgent({
  workspace,
  prompt,
  mode = "agent",
  timeoutSec = 300,
  mitiiBin,
  env = {},
  signal,
}) {
  const bin = resolveMitiiBin(mitiiBin);
  if (!bin) {
    return {
      exitCode: 127,
      stdout: "",
      stderr:
        "Mitii CLI not found. Set MITII_BIN or runner.config.json mitiiBin to apps/cli/bin/mitii.js",
      durationMs: 0,
      timedOut: false,
      skipped: true,
    };
  }

  const promptDir = mkdtempSync(join(tmpdir(), "mitii-bench-prompt-"));
  const promptFile = join(promptDir, "prompt.md");
  writeFileSync(promptFile, String(prompt ?? ""), "utf8");

  try {
    const args = buildMitiiArgs({ bin, workspace, promptFile, mode });
    const command = bin.endsWith(".js") ? process.execPath : bin;
    const finalArgs = bin.endsWith(".js") ? args : args.slice(1);

    return await runProcess({
      command,
      args: finalArgs,
      cwd: workspace,
      timeoutMs: timeoutSec * 1000,
      env: {
        CI: "1",
        ...env,
      },
      signal,
    });
  } finally {
    rmSync(promptDir, { recursive: true, force: true });
  }
}

export function buildMitiiArgs({ bin, workspace, promptFile, mode = "agent" }) {
  const prefix = bin.endsWith(".js") ? [bin] : [];
  const verb =
    mode === "plan" || mode === "agent" || mode === "ask" ? mode : "agent";
  const args = [
    ...prefix,
    verb,
    "--cwd",
    workspace,
    "--prompt-file",
    promptFile,
    "--origin",
    "automation",
  ];

  // Unattended edits for bench: apply autonomy (no interactive approvals).
  if (verb === "agent") {
    args.push("--autonomy", "apply");
  }

  return args;
}

/**
 * Read the latest Mitii CLI session metrics from workspace `.mitii/logs/*.jsonl`.
 */
export function readMitiiSessionMetrics(workspace) {
  const logsDir = join(workspace, ".mitii", "logs");
  if (!existsSync(logsDir)) return null;

  const files = readdirSync(logsDir)
    .filter((name) => name.startsWith("cli-") && name.endsWith(".jsonl"))
    .sort();
  if (files.length === 0) return null;

  const latest = join(logsDir, files[files.length - 1]);
  let start;
  let end;
  for (const line of readFileSync(latest, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let event;
    try {
      event = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (event.type === "session_start") start = event;
    if (event.type === "session_end") end = event;
  }
  if (!start && !end) return null;

  const usage = end?.usage ?? {};
  const inputTokens = Number(usage.inputTokens ?? 0);
  const outputTokens = Number(usage.outputTokens ?? 0);
  const startTime = start?.ts ?? null;
  const endTime = end?.ts ?? null;
  let durationMs = usage.durationMs;
  if (durationMs == null && startTime && endTime) {
    durationMs = Date.parse(endTime) - Date.parse(startTime);
  }

  return {
    logFile: latest,
    model: start?.provider ?? null,
    provider: start?.provider ?? null,
    mode: start?.mode ?? end?.mode ?? null,
    startTime,
    endTime,
    durationMs: Number.isFinite(durationMs) ? durationMs : null,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    modelCalls: usage.modelCalls ?? null,
    toolCalls: usage.toolCalls ?? null,
    loopIterations: usage.loopIterations ?? null,
    exitCode: end?.exitCode ?? null,
  };
}

export function resolveMitiiBin(configured) {
  const candidates = [
    configured,
    process.env.MITII_BIN,
    process.env.MITII_CLI,
  ].filter(Boolean);

  // Common sibling layout: ai-agents/Mitii next to ai-agents/mitii-bench
  const sibling = resolve(
    process.cwd(),
    "../Mitii/apps/cli/bin/mitii.js",
  );
  candidates.push(sibling);

  for (const candidate of candidates) {
    const abs = resolve(candidate);
    if (existsSync(abs)) return abs;
  }
  return null;
}

function runProcess({ command, args, cwd, env, timeoutMs, signal }) {
  return new Promise((resolvePromise) => {
    const startedAt = Date.now();
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 2000).unref();
    }, timeoutMs);

    const onAbort = () => {
      child.kill("SIGTERM");
    };
    if (signal) {
      if (signal.aborted) onAbort();
      else signal.addEventListener("abort", onAbort, { once: true });
    }

    child.stdout.on("data", (c) => {
      stdout += c;
    });
    child.stderr.on("data", (c) => {
      stderr += c;
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolvePromise({
        exitCode: 1,
        stdout,
        stderr: `${stderr}\n${error.message}`.trim(),
        durationMs: Date.now() - startedAt,
        timedOut,
      });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolvePromise({
        exitCode: timedOut ? 124 : code ?? 1,
        stdout,
        stderr,
        durationMs: Date.now() - startedAt,
        timedOut,
      });
    });
  });
}
