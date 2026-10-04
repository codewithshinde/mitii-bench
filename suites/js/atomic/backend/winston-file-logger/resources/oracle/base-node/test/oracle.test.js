import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("winston logger", () => {
  it("configures error.log and combined.log transports", () => {
    const src = readFileSync("src/logger.js", "utf8");
    assert.match(src, /winston/);
    assert.match(src, /error\.log/);
    assert.match(src, /combined\.log/);
    assert.match(src, /Console/);
  });
});
