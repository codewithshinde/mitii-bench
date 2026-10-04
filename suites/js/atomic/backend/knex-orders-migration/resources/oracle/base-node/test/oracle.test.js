import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("orders migration", () => {
  it("defines up/down for orders table", () => {
    const src = readFileSync(new URL("../migrations/001_orders.js", import.meta.url), "utf8");
    assert.match(src, /orders/);
    assert.match(src, /export async function up/);
    assert.match(src, /export async function down/);
    assert.match(src, /user_id/);
    assert.match(src, /created_at/);
  });
});
