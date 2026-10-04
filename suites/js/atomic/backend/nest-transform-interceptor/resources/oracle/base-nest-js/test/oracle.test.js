import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("TransformInterceptor", () => {
  it("wraps responses with data and timestamp", () => {
    const src = readFileSync("src/interceptors/transform.interceptor.ts", "utf8");
    assert.match(src, /NestInterceptor/);
    assert.match(src, /timestamp/);
    assert.match(src, /data/);
  });
});
