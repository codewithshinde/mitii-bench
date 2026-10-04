import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { requestIdMiddleware, logWithContext } from "../src/requestContext.js";

describe("request context", () => {
  it("propagates x-request-id through async local storage", () => {
    const req = { headers: { "x-request-id": "req-123" } };
    const res = { setHeader() {} };
    requestIdMiddleware(req, res, () => {
      const entry = logWithContext("deep log");
      assert.equal(entry.requestId, "req-123");
      assert.equal(entry.message, "deep log");
    });
  });

  it("generates an id when header is missing", () => {
    const req = { headers: {} };
    const res = { setHeader() {} };
    requestIdMiddleware(req, res, () => {
      const entry = logWithContext("auto");
      assert.notEqual(entry.requestId, "unknown");
    });
  });
});
