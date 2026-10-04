import { describe, it } from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import { workerCount, forkWorkers } from "../src/clusterServer.js";

describe("clusterServer helpers", () => {
  it("uses cpu count for worker sizing", () => {
    assert.equal(workerCount(), os.cpus().length);
  });

  it("forkWorkers returns empty array when not primary", () => {
    const fakeCluster = {
      isPrimary: false,
      fork() {
        throw new Error("fork should not be called");
      },
    };
    assert.deepEqual(forkWorkers(undefined, fakeCluster), []);
  });

  it("forkWorkers invokes onMessage for each forked worker", () => {
    let forkCalls = 0;
    const fakeCluster = {
      isPrimary: true,
      fork() {
        forkCalls += 1;
        return { id: forkCalls };
      },
    };
    const seen = [];
    const workers = forkWorkers((worker) => seen.push(worker), fakeCluster);
    assert.equal(workers.length, os.cpus().length);
    assert.equal(seen.length, os.cpus().length);
  });
});
