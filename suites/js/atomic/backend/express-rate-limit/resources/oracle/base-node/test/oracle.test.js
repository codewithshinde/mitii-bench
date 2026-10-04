import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { rateLimitMiddleware, _resetRateLimitStore } from "../src/rateLimit.js";

function hit(n, ip = "1.2.3.4") {
  const app = express();
  app.set("trust proxy", true);
  app.use((req, _res, next) => {
    req.ip = ip;
    next();
  });
  app.use(rateLimitMiddleware);
  app.get("/", (_req, res) => res.json({ ok: true }));
  return new Promise((resolve) => {
    const server = app.listen(0, async () => {
      const port = server.address().port;
      const statuses = [];
      for (let i = 0; i < n; i++) {
        const r = await fetch(`http://127.0.0.1:${port}/`);
        statuses.push({ status: r.status, limit: r.headers.get("x-ratelimit-limit"), remaining: r.headers.get("x-ratelimit-remaining"), retry: r.headers.get("retry-after") });
      }
      server.close(() => resolve(statuses));
    });
  });
}

describe("rateLimitMiddleware", () => {
  beforeEach(() => _resetRateLimitStore());

  it("allows 5 requests then blocks with headers", async () => {
    const results = await hit(6);
    assert.ok(results.slice(0, 5).every((r) => r.status === 200));
    assert.equal(results[5].status, 429);
    assert.equal(results[0].limit, "5");
    assert.ok(Number(results[4].remaining) >= 0);
    assert.ok(results[5].retry);
  });
});
