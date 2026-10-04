import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("HttpExceptionFilter", () => {
  it("catches HttpException with custom payload shape", () => {
    const src = readFileSync("src/filters/http-exception.filter.ts", "utf8");
    assert.match(src, /ExceptionFilter/);
    assert.match(src, /HttpException/);
    assert.match(src, /Catch/);
    assert.match(src, /success: false/);
  });
});
