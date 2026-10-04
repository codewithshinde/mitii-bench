import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fibonacciInWorker } from "../src/index.js";

describe("fibonacciInWorker", () => {
  it("computes fibonacci in a worker thread", async () => {
    assert.equal(await fibonacciInWorker(10), 55);
  });

  it("handles base cases", async () => {
    assert.equal(await fibonacciInWorker(0), 0);
    assert.equal(await fibonacciInWorker(1), 1);
  });
});
