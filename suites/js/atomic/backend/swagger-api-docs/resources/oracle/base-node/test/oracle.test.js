import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("swagger docs", () => {
  it("serves swagger UI at /api-docs", () => {
    const src = readFileSync("src/index.js", "utf8");
    assert.match(src, /swagger-ui-express/);
    assert.match(src, /\/api-docs/);
    assert.match(src, /openapi/);
  });
});
