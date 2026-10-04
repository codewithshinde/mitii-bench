import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { tenantMiddleware } from "../src/index.js";

describe("tenant-isolation", () => {
  it("sets tenant from x-tenant-id header", () => {
    const req = { header: (h) => (h === "x-tenant-id" ? "tenant1" : undefined), hostname: "localhost" };
    const res = { status: () => ({ json: () => {} }) };
    tenantMiddleware(req, res, () => {});
    assert.equal(req.tenant, "tenant1");
    assert.ok(req.tenantStore);
  });
});
