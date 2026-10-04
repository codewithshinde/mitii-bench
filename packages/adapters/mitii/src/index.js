import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Invoke Mitii CLI against an isolated workspace.
 * Config lives here — not in individual task.yaml files.
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

  const args = [
    bin.endsWith(".js") ? bin : null,
    "agent",
    "--cwd",
    workspace,
    "--mode",
    mode,
    "--prompt",
    prompt,
  ].filter(Boolean);

  const command = bin.endsWith(".js") ? process.execPath : bin;
  const finalArgs = bin.endsWith(".js") ? args : args.slice(1);

  return runProcess({
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
