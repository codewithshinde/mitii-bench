import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { authenticateToken, signToken } from "../src/authenticateToken.js";

describe("authenticateToken", () => {
  it("populates req.user for valid Bearer token", async () => {
    const token = signToken({ sub: "u1" });
    const app = express();
    app.get("/", authenticateToken, (req, res) => res.json({ id: req.user.sub }));
    const out = await new Promise((resolve) => {
      const server = app.listen(0, async () => {
        const port = server.address().port;
        const r = await fetch(`http://127.0.0.1:${port}/`, { headers: { authorization: `Bearer ${token}` } });
        const json = await r.json();
        server.close(() => resolve({ status: r.status, json }));
      });
    });
    assert.equal(out.status, 200);
    assert.equal(out.json.id, "u1");
  });

  it("returns 401 without token", async () => {
    const app = express();
    app.get("/", authenticateToken, (_req, res) => res.json({ ok: true }));
    const out = await new Promise((resolve) => {
      const server = app.listen(0, async () => {
        const port = server.address().port;
        const r = await fetch(`http://127.0.0.1:${port}/`);
        server.close(() => resolve(r.status));
      });
    });
    assert.equal(out, 401);
  });
});
