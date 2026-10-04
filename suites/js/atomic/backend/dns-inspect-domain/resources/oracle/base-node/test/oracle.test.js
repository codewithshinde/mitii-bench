import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { inspectDomain } from "../src/inspectDomain.js";

describe("inspectDomain", () => {
  it("returns A, MX, and TXT records from injected resolver", async () => {
    const fake = {
      resolve4: async () => ["93.184.216.34"],
      resolveMx: async () => [{ exchange: "mail.example.com", priority: 10 }],
      resolveTxt: async () => [["v=spf1 include:_spf.example.com ~all"]],
    };
    const out = await inspectDomain("example.com", fake);
    assert.deepEqual(out.a, ["93.184.216.34"]);
    assert.deepEqual(out.mx, [{ exchange: "mail.example.com", priority: 10 }]);
    assert.match(out.txt[0], /spf1/);
  });

  it("returns empty arrays when resolver finds nothing", async () => {
    const fake = {
      resolve4: async () => {
        throw new Error("ENOTFOUND");
      },
      resolveMx: async () => {
        throw new Error("ENOTFOUND");
      },
      resolveTxt: async () => {
        throw new Error("ENOTFOUND");
      },
    };
    const out = await inspectDomain("missing.test", fake);
    assert.deepEqual(out, { domain: "missing.test", a: [], mx: [], txt: [] });
  });
});
