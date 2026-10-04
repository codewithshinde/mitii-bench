import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { withDeadlockRetry } from "../src/deadlockRetry.js";

describe("deadlock-retry", () => {
  it("retries on postgres deadlock codes", async () => {
    let calls = 0;
    const result = await withDeadlockRetry(async () => {
      calls += 1;
      if (calls < 2) { const e = new Error("deadlock"); e.code = "40001"; throw e; }
      return "ok";
    }, { baseDelayMs: 1 });
    assert.equal(result, "ok");
    assert.equal(calls, 2);
  });
});
