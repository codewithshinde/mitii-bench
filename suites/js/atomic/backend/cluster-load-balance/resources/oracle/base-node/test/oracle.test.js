import { describe, it } from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import { workerCount, forkWorkers } from "../src/clusterServer.js";

describe("clusterServer helpers", () => {
  it("uses cpu count for worker sizing", () => {
    assert.equal(workerCount(), os.cpus().length);
  });

  it("returns an array from forkWorkers in worker context", () => {
    const workers = forkWorkers();
    assert.ok(Array.isArray(workers));
  });
});
