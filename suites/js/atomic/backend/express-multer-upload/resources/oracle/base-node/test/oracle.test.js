import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("multer upload route", () => {
  it("registers POST /api/upload with multer limits", () => {
    const src = readFileSync(new URL("../src/index.js", import.meta.url));
    const text = src.toString("utf8");
    assert.match(text, /multer/);
    assert.match(text, /2 \* 1024 \* 1024/);
    assert.match(text, /image\/png/);
    assert.match(text, /\/api\/upload/);
  });
});
