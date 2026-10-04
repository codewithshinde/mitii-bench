import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { redis, idempotencyMiddleware } from "../src/index.js";

describe("idempotency-middleware", () => {
  it("caches responses by Idempotency-Key", () => {
    redis.kv.clear();
    let body;
    const req = { method: "POST", header: (h) => (h === "Idempotency-Key" ? "k1" : undefined), body: { amount: 5 } };
    const res = {
      statusCode: 201,
      status(c) { this.statusCode = c; return this; },
      json(b) { body = b; return this; },
    };
    idempotencyMiddleware(req, res, () => res.json({ paid: true, amount: 5 }));
    assert.deepEqual(body, { paid: true, amount: 5 });
    let cached;
    const res2 = { statusCode: 200, status() { return this; }, json(b) { cached = b; } };
    idempotencyMiddleware(req, res2, () => res2.json({ paid: false }));
    assert.deepEqual(cached, { paid: true, amount: 5 });
  });
});
