import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { createCsvToJsonlTransform } from "../src/csvTransform.js";

function collect(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (c) => chunks.push(c));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

describe("createCsvToJsonlTransform", () => {
  it("converts CSV rows to jsonl without loading entire file", async () => {
    const csv = "id,name\n1,Ada\n2,Bob\n";
    const out = await collect(Readable.from([csv]).pipe(createCsvToJsonlTransform()));
    const lines = out.trim().split("\n");
    assert.equal(lines.length, 2);
    assert.deepEqual(JSON.parse(lines[0]), { id: "1", name: "Ada" });
    assert.deepEqual(JSON.parse(lines[1]), { id: "2", name: "Bob" });
  });

  it("ignores blank lines", async () => {
    const csv = "a\n\n1\n";
    const out = await collect(Readable.from([csv]).pipe(createCsvToJsonlTransform()));
    assert.equal(out.trim().split("\n").length, 1);
  });
});
