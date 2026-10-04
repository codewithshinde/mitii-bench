import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import productsRouter from "../src/routes/products.js";
import ordersRouter from "../src/routes/orders.js";

describe("modular routers", () => {
  it("products and orders routers respond", async () => {
    const app = express();
    app.use("/api/v1/products", productsRouter);
    app.use("/api/v1/orders", ordersRouter);
    const port = await new Promise((resolve) => {
      const server = app.listen(0, () => resolve(server.address().port));
    });
    const p = await fetch(`http://127.0.0.1:${port}/api/v1/products`);
    const o = await fetch(`http://127.0.0.1:${port}/api/v1/orders`);
    assert.equal(p.status, 200);
    assert.equal(o.status, 200);
    const pj = await p.json();
    const oj = await o.json();
    assert.ok(Array.isArray(pj.items));
    assert.ok(Array.isArray(oj.items));
  });
});
