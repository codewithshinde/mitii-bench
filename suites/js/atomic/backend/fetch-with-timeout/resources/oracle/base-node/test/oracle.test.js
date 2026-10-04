import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fetchWithTimeout, TimeoutError } from "../src/fetchWithTimeout.js";

describe("fetchWithTimeout", () => {
  it("returns the response when fetch resolves quickly", async () => {
    const mock = async () => ({ ok: true, status: 200 });
    const res = await fetchWithTimeout("https://example.com", 1000, mock);
    assert.equal(res.status, 200);
  });

  it("rejects with TimeoutError when fetch is aborted", async () => {
    const mock = (_url, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener("abort", () => {
          const err = new Error("aborted");
          err.name = "AbortError";
          reject(err);
        });
      });
    await assert.rejects(
      () => fetchWithTimeout("https://slow.example", 20, mock),
      (err) => err instanceof TimeoutError,
    );
  });
});
