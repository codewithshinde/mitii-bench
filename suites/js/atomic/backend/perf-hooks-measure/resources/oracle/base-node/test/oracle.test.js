import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { measureExecutionTime } from "../src/measureExecutionTime.js";

describe("measureExecutionTime", () => {
  it("measures sync work", async () => {
    const { result, durationMs } = await measureExecutionTime(() => 42);
    assert.equal(result, 42);
    assert.ok(durationMs >= 0);
  });
});
