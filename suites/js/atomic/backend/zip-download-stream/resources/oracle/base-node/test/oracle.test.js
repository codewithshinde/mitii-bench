import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("zip-download-stream", () => {
  it("loads archiver zip route module", async () => {
    const mod = await import("../src/index.js");
    assert.ok(mod.app);
  });
});
