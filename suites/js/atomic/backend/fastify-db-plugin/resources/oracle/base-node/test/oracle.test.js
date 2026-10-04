import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildServer } from "../src/server.js";

describe("fastify db plugin", () => {
  it("decorates fastify.db via fastify-plugin", async () => {
    const app = await buildServer();
    await app.ready();
    assert.equal(typeof app.db.query, "function");
    const res = await app.inject({ method: "GET", url: "/db-check" });
    assert.equal(res.statusCode, 200);
    assert.equal(res.json().sql, "SELECT 1");
    await app.close();
  });
});
