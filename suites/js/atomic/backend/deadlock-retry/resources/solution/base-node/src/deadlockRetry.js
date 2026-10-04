const RETRY_CODES = new Set(["40001", "40P01"]);

/** retry helper for postgres deadlock error codes 40001 / 40P01. */
export async function withDeadlockRetry(fn, { maxRetries = 3, baseDelayMs = 10 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      const code = err?.code ?? err?.errno;
      attempt += 1;
      if (!RETRY_CODES.has(String(code)) || attempt > maxRetries) throw err;
      const jitter = Math.floor(Math.random() * baseDelayMs);
      await new Promise((r) => setTimeout(r, baseDelayMs * attempt + jitter));
    }
  }
}
