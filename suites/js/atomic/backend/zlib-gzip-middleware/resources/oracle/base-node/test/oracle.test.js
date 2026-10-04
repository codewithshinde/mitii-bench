import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { shouldCompress } from "../src/gzipMiddleware.js";

describe("gzip middleware", () => {
  it("detects gzip accept encoding", () => {
    assert.equal(shouldCompress({ headers: { "accept-encoding": "gzip, deflate" } }), true);
    assert.equal(shouldCompress({ headers: { "accept-encoding": "identity" } }), false);
  });

  it("handles missing accept-encoding header", () => {
    assert.equal(shouldCompress({ headers: {} }), false);
  });
});
