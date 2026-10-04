import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { payloadSizeGuard } from "../src/payloadGuard.js";

describe("payload-size-guard", () => {
  it("rejects Content-Length above threshold", () => {
    let status;
    const req = { headers: { "content-length": "99999" }, on: () => req, destroy: () => {} };
    const res = { headersSent: false, status: (c) => ({ json: () => { status = c; } }) };
    payloadSizeGuard(1024)(req, res, () => { status = 200; });
    assert.equal(status, 413);
  });
});
