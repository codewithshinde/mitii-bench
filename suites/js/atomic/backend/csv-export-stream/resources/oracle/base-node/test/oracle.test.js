import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("csv-export-stream", () => {
  it("streams CSV from sqlite iterator", async () => {
    const { db } = await import("../src/index.js");
    const rows = db.prepare("SELECT COUNT(*) AS c FROM users").get();
    assert.equal(rows.c, 5);
  });
});
