import { spawn } from "node:child_process";

export function runProcess({
  command,
  args = [],
  cwd,
  env = {},
  timeoutMs = 120000,
  shell = false,
  signal,
}) {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve({
        exitCode: 130,
        stdout: "",
        stderr: "Aborted before start",
        durationMs: 0,
        timedOut: false,
        aborted: true,
      });
      return;
    }

    const startedAt = Date.now();
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, ...env },
      shell,
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let aborted = false;
    const timer = setTimeout(() => {
      timedOut = true;
      terminateTree(child, "SIGTERM");
      setTimeout(() => terminateTree(child, "SIGKILL"), 2000).unref();
    }, timeoutMs);

    const onAbort = () => {
      aborted = true;
      terminateTree(child, "SIGTERM");
    };
    if (signal) {
      if (signal.aborted) onAbort();
      else signal.addEventListener("abort", onAbort, { once: true });
    }

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      resolve({
        exitCode: aborted ? 130 : 1,
        stdout,
        stderr: `${stderr}\n${error.message}`.trim(),
        durationMs: Date.now() - startedAt,
        timedOut,
        aborted,
      });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      resolve({
        exitCode: timedOut ? 124 : aborted ? 130 : (code ?? 1),
        stdout,
        stderr,
        durationMs: Date.now() - startedAt,
        timedOut,
        aborted,
      });
    });
  });
}

function terminateTree(child, signal) {
  try {
    if (process.platform !== "win32" && child.pid) process.kill(-child.pid, signal);
    else child.kill(signal);
  } catch {
    // already exited
  }
}
