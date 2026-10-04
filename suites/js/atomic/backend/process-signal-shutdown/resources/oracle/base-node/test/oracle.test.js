import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { setupGracefulShutdown } from "../src/gracefulShutdown.js";

describe("setupGracefulShutdown", () => {
  it("closes server and clears timers on shutdown", async () => {
    let closed = false;
    const server = {
      close(cb) {
        closed = true;
        cb?.();
      },
    };
    const ctl = setupGracefulShutdown(server);
    ctl.registerTimer(setTimeout(() => {}, 10000));
    await ctl.shutdown("SIGTERM");
    assert.equal(closed, true);
    assert.equal(ctl.isShuttingDown(), true);
    ctl.dispose();
  });

  it("ignores duplicate shutdown attempts", async () => {
    const ctl = setupGracefulShutdown(null);
    await ctl.shutdown("SIGINT");
    await ctl.shutdown("SIGINT");
    assert.equal(ctl.isShuttingDown(), true);
    ctl.dispose();
  });
});
