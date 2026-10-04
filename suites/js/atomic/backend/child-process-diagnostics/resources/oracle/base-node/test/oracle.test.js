import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { runSystemDiagnostics } from "../src/diagnostics.js";

describe("runSystemDiagnostics", () => {
  it("returns stdout and exitCode for a quick command", async () => {
    const result = await runSystemDiagnostics();
    assert.match(result.stdout.trim(), /diagnostics-ok/);
    assert.equal(result.exitCode, 0);
  });

  it("rejects when the command exceeds 5 seconds", async () => {
    const hang =
      process.platform === "win32"
        ? "cmd /c ping -n 6 127.0.0.1 > nul"
        : "sleep 6";
    await assert.rejects(() => runSystemDiagnostics(hang), /Timeout/);
  });
});
