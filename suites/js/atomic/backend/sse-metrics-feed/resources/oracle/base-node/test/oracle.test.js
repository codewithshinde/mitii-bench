import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("sse-metrics-feed", () => {
  it("exports SSE server", async () => {
    const { app } = await import("../src/index.js");
    assert.ok(app);
  });
});
