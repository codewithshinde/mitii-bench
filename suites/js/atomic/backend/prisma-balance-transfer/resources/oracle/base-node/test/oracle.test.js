import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { transferBalance } from "../src/transferBalance.js";
import { prisma } from "../src/prismaClient.js";

describe("transferBalance", () => {
  it("moves funds atomically inside $transaction", async () => {
    await transferBalance(1, 2, 25);
    const alice = prisma.user.findUnique({ where: { id: 1 } });
    const bob = prisma.user.findUnique({ where: { id: 2 } });
    assert.equal(alice.balance, 75);
    assert.equal(bob.balance, 75);
  });

  it("rejects insufficient balance", async () => {
    await assert.rejects(() => transferBalance(1, 2, 9999), /Insufficient funds/);
  });
});
