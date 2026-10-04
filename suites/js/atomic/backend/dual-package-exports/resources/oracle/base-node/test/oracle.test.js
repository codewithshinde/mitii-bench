import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { formatCurrency } from "../src/formatCurrency.js";

describe("formatCurrency dual package", () => {
  it("formats USD values", () => {
    assert.equal(formatCurrency(12.5), "$12.50");
    assert.equal(formatCurrency("nope"), "$0.00");
  });

  it("declares import and require export conditions", () => {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    assert.equal(pkg.exports["."].import, "./src/formatCurrency.js");
    assert.equal(pkg.exports["."].require, "./formatCurrency.cjs");
  });
});
