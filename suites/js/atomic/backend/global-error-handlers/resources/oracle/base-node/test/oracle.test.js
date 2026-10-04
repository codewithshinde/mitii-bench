import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { installCrashGuard } from "../src/crashGuard.js";

describe("installCrashGuard", () => {
  /** @type {string} */
  let dir;

  before(async () => {
    dir = await mkdtemp(join(tmpdir(), "crash-guard-"));
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("registers process listeners and returns config", () => {
    const beforeCount = process.listenerCount("uncaughtException");
    const logPath = join(dir, "crash.log");
    const result = installCrashGuard(logPath, { exitFn() {} });
    assert.equal(result.installed, true);
    assert.equal(result.logPath, logPath);
    assert.ok(process.listenerCount("uncaughtException") >= beforeCount + 1);
    assert.ok(process.listenerCount("unhandledRejection") >= 1);
  });

  it("writes structured JSON when unhandledRejection fires", async () => {
    const logPath = join(dir, "reject.log");
    installCrashGuard(logPath, { exitFn() {} });
    process.emit("unhandledRejection", new Error("boom"));
    await new Promise((r) => setTimeout(r, 50));
    const lines = (await readFile(logPath, "utf8")).trim().split("\n");
    const last = JSON.parse(lines.at(-1));
    assert.equal(last.kind, "unhandledRejection");
    assert.match(last.message, /boom/);
  });
});
