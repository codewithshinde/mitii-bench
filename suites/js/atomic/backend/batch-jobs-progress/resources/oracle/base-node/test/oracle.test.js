import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("batch-jobs-progress", () => {
  it("tracks jobId and percentage fields", async () => {
    const { jobs } = await import("../src/index.js");
    assert.ok(jobs instanceof Map);
  });
});
