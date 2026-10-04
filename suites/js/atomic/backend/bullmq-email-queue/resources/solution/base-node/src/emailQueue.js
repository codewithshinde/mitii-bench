import MemoryRedis from "./memoryRedis.js";

/** BullMQ-shaped email queue using in-memory Redis for dry-run. */
const connection = new MemoryRedis();
const jobs = [];
let jobId = 0;

export const emailQueue = {
  name: "emailQueue",
  async add(name, data, opts = {}) {
    const id = String(++jobId);
    const job = {
      id,
      name,
      data,
      opts: { attempts: opts.attempts ?? 3, backoff: opts.backoff ?? { type: "exponential", delay: 1000 } },
      attemptsMade: 0,
    };
    jobs.push(job);
    return job;
  },
  _jobs() {
    return jobs;
  },
};

export function createEmailWorker(processor, { concurrency = 5 } = {}) {
  let active = 0;
  const queue = [...jobs];
  async function drain() {
    while (queue.length && active < concurrency) {
      const job = queue.shift();
      active += 1;
      try {
        await processor(job);
      } catch (err) {
        job.attemptsMade += 1;
        if (job.attemptsMade < (job.opts.attempts ?? 3)) {
          queue.push(job);
        } else {
          job.failedReason = err.message;
        }
      } finally {
        active -= 1;
      }
    }
  }
  return {
    connection,
    async run() {
      await drain();
    },
    getFailed() {
      return jobs.filter((j) => j.failedReason);
    },
  };
}
