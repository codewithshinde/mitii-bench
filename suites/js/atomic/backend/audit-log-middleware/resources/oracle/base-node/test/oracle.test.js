import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { auditMiddleware, auditLog } from "../src/index.js";

describe("audit-log-middleware", () => {
  it("records POST mutations", () => {
    auditLog.length = 0;
    const req = { method: "POST", path: "/resources", header: () => "u1", body: { x: 1 }, ip: "127.0.0.1", socket: {} };
    const res = { statusCode: 201, on: (ev, fn) => ev === "finish" && fn() };
    auditMiddleware(req, res, () => {});
    assert.equal(auditLog.length, 1);
    assert.equal(auditLog[0].method, "POST");
  });
});
