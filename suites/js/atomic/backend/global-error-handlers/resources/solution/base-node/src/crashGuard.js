import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export function installCrashGuard(logPath = "logs/crash.log", options = {}) {
  const exitFn = options.exitFn ?? (() => process.exit(1));

  async function logAndExit(kind, error) {
    await mkdir(dirname(logPath), { recursive: true });
    const payload = {
      kind,
      message: error?.message ?? String(error),
      timestamp: new Date().toISOString(),
    };
    await appendFile(logPath, JSON.stringify(payload) + "\n", "utf8");
    exitFn(1);
  }

  process.on("uncaughtException", (err) => {
    logAndExit("uncaughtException", err).catch(() => exitFn(1));
  });
  process.on("unhandledRejection", (reason) => {
    logAndExit("unhandledRejection", reason).catch(() => exitFn(1));
  });

  return { installed: true, logPath };
}
