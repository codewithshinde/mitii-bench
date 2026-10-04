import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("server entry exports listen path", () => {
  const src = readFileSync("src/index.js", "utf8");
  assert.match(src, /\/health/);
  assert.match(src, /express/);
});
