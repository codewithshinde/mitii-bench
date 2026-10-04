import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LocalStorageProvider, S3StorageProvider } from "../src/storage.js";

describe("storage-abstraction", () => {
  it("local and s3 providers share upload/delete/getUrl", async () => {
    const s3 = new S3StorageProvider("b");
    const up = await s3.upload("a.txt", "data");
    assert.match(up.url, /s3.amazonaws.com/);
    assert.equal(s3.getUrl("a.txt"), up.url);
    await s3.delete("a.txt");
    const local = new LocalStorageProvider();
    assert.equal(typeof local.upload, "function");
  });
});
