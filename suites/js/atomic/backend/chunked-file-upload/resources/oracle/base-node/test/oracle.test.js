import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("chunked-file-upload", () => {
  it("tracks upload sessions in memory", async () => {
    const { uploads } = await import("../src/index.js");
    assert.ok(uploads instanceof Map);
  });
});
