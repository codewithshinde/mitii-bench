import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import MemoryRedis from "../src/memoryRedis.js";
import { cacheMiddleware } from "../src/cacheMiddleware.js";

describe("cacheMiddleware", () => {
  beforeEach(() => MemoryRedis.reset());

  it("caches JSON responses by originalUrl", async () => {
    let hits = 0;
    const app = express();
    app.use(cacheMiddleware);
    app.get("/api/x", (_req, res) => {
      hits += 1;
      res.json({ n: hits });
    });
    const { port, server } = await new Promise((resolve) => {
      const srv = app.listen(0, () => resolve({ port: srv.address().port, server: srv }));
    });
    const url = `http://127.0.0.1:${port}/api/x?a=1`;
    const r1 = await fetch(url);
    const j1 = await r1.json();
    const r2 = await fetch(url);
    const j2 = await r2.json();
    assert.equal(j1.n, 1);
    assert.equal(j2.n, 1);
    assert.equal(r2.headers.get("x-cache"), "HIT");
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  });
});
