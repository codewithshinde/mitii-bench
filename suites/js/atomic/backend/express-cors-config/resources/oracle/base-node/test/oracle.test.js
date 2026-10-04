import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { corsMiddleware } from "../src/corsMiddleware.js";

describe("corsMiddleware", () => {
  it("allows *.example.com origins", async () => {
    const app = express();
    app.use(corsMiddleware);
    app.get("/", (_req, res) => res.end("ok"));
    const headers = await new Promise((resolve) => {
      const server = app.listen(0, async () => {
        const port = server.address().port;
        const r = await fetch(`http://127.0.0.1:${port}/`, { headers: { origin: "https://app.example.com" } });
        server.close(() => resolve(Object.fromEntries(r.headers.entries())));
      });
    });
    assert.equal(headers["access-control-allow-origin"], "https://app.example.com");
    assert.match(headers["access-control-allow-methods"], /GET/);
    assert.match(headers["access-control-expose-headers"], /X-Total-Count/);
  });
});
