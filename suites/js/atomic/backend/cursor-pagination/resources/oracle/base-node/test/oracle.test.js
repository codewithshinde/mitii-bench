import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { encodeCursor, decodeCursor } from "../src/index.js";

describe("cursor-pagination", () => {
  it("round-trips cursor tokens", () => {
    const c = encodeCursor({ id: 10 });
    assert.deepEqual(decodeCursor(c), { id: 10 });
  });
});
