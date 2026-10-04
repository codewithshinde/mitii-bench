import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { record401, bans, MAX_FAILS } from "../src/index.js";

describe("ip-ban-sliding-window", () => {
  it("bans after more than 10 failures in window", () => {
    bans.clear();
    const ip = "10.0.0.1";
    for (let i = 0; i <= MAX_FAILS; i++) record401(ip);
    assert.ok(bans.has(ip));
  });
});
