import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildServer } from "../src/server.js";

describe("fastify schema route", () => {
  it("validates body and returns typed response", async () => {
    const app = await buildServer();
    await app.ready();
    const ok = await app.inject({ method: "POST", url: "/items", payload: { name: "Pen", qty: 2 } });
    assert.equal(ok.statusCode, 200);
    const body = ok.json();
    assert.equal(body.name, "Pen");
    assert.equal(body.qty, 2);

    const bad = await app.inject({ method: "POST", url: "/items", payload: { name: "Pen", qty: 0 } });
    assert.equal(bad.statusCode, 400);
    await app.close();
  });
});
