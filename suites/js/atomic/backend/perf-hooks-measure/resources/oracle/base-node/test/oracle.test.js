import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { measureExecutionTime } from "../src/measureExecutionTime.js";

describe("measureExecutionTime", () => {
  it("measures async function duration", async () => {
    const { result, durationMs } = await measureExecutionTime(async () => {
      await new Promise((r) => setTimeout(r, 5));
      return 42;
    });
    assert.equal(result, 42);
    assert.ok(durationMs >= 0);
  });

  it("measures sync return values", async () => {
    const { result, durationMs } = await measureExecutionTime(() => "ok");
    assert.equal(result, "ok");
    assert.ok(durationMs >= 0);
  });
});
