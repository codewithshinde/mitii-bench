import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

describe("UsersController", () => {
  it("declares GET/POST users with injected service", () => {
    const ctrl = readFileSync("src/users/users.controller.ts", "utf8");
    const svc = readFileSync("src/users/users.service.ts", "utf8");
    assert.match(ctrl, /UsersController/);
    assert.match(ctrl, /@Get()/);
    assert.match(ctrl, /@Post()/);
    assert.match(ctrl, /UsersService/);
    assert.match(svc, /findAll/);
    assert.match(svc, /create/);
  });
});
