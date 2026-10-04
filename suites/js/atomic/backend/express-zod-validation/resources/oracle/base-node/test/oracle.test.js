import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { validateUserBody } from "../src/index.js";

async function post(body) {
  const app = express();
  app.use(express.json());
  app.post("/api/users", validateUserBody, (req, res) => res.status(201).json({ user: req.validated }));
  return new Promise((resolve) => {
    const server = app.listen(0, async () => {
      const port = server.address().port;
      const r = await fetch(`http://127.0.0.1:${port}/api/users`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await r.json();
      server.close(() => resolve({ status: r.status, json }));
    });
  });
}

describe("zod validation", () => {
  it("accepts valid payload", async () => {
    const { status, json } = await post({ email: "a@b.com", age: 21, password: "longenough" });
    assert.equal(status, 201);
    assert.equal(json.user.email, "a@b.com");
  });

  it("returns 400 with structured errors", async () => {
    const { status, json } = await post({ email: "bad", age: 10, password: "short" });
    assert.equal(status, 400);
    assert.ok(Array.isArray(json.errors));
    assert.ok(json.errors.length >= 2);
  });
});
