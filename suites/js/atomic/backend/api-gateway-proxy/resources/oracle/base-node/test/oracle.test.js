import { describe, it, after } from "node:test";
import assert from "node:assert/strict";

describe("api-gateway-proxy", () => {
  after(async () => {
    const { server, downstream } = await import("../src/index.js");
    await Promise.all([
      new Promise((resolve) => server?.close?.(resolve)),
      new Promise((resolve) => downstream?.close?.(resolve)),
    ]);
  });

  it("loads proxy gateway module", async () => {
    const mod = await import("../src/index.js");
    assert.ok(mod.app);
  });
});
