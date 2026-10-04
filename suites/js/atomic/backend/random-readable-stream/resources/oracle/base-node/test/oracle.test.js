import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { RandomDataStream } from "../src/RandomDataStream.js";

describe("RandomDataStream", () => {
  it("emits deterministic integers when seeded", async () => {
    const stream = new RandomDataStream({ count: 3, min: 1, max: 5, seed: 2 });
    const values = [];
    for await (const n of stream) values.push(n);
    assert.deepEqual(values, [3, 4, 5]);
  });

  it("ends after requested count", async () => {
    const stream = new RandomDataStream({ count: 2, seed: 0 });
    const values = [];
    for await (const n of stream) values.push(n);
    assert.equal(values.length, 2);
  });
});
