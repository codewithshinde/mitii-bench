import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { detectFileType } from "../src/detectFileType.js";

describe("detectFileType", () => {
  it("detects PNG", () => {
    assert.equal(detectFileType(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d])), "png");
  });
  it("detects JPEG", () => {
    assert.equal(detectFileType(Buffer.from([0xff, 0xd8, 0xff, 0xe0])), "jpg");
  });
  it("returns unknown for short buffers", () => {
    assert.equal(detectFileType(Buffer.from([1, 2])), "unknown");
  });
});
