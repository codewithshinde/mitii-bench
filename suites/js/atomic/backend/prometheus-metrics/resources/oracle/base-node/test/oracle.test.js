import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("prometheus-metrics", () => {
  it("exports prom-client registry", async () => {
    const { register } = await import("../src/index.js");
    const metrics = await register.metrics();
    assert.match(metrics, /process_cpu/);
  });
});
