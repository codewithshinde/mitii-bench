import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { emailQueue, createEmailWorker } from "../src/emailQueue.js";

describe("emailQueue", () => {
  it("processes jobs with retry/backoff settings", async () => {
    await emailQueue.add(
      "send",
      { to: "a@b.com" },
      { attempts: 3, backoff: { type: "exponential", delay: 10 } },
    );
    const processed = [];
    const worker = createEmailWorker(async (job) => {
      processed.push(job.data.to);
    }, { concurrency: 5 });
    await worker.run();
    assert.deepEqual(processed, ["a@b.com"]);
    const job = emailQueue._jobs()[0];
    assert.equal(job.opts.attempts, 3);
    assert.equal(job.opts.backoff.type, "exponential");
  });
});
