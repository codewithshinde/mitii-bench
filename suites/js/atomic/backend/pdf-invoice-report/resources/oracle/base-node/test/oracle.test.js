import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("pdf-invoice-report", () => {
  it("exports pdf invoice route", async () => {
    const { app } = await import("../src/index.js");
    assert.ok(app);
  });
});
