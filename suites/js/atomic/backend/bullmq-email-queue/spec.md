Build a background email processing job queue using `bullmq` and Redis.

* **Queue**: `emailQueue`
* **Worker**: Processes jobs with concurrency of 5 and retry mechanism (3 attempts with exponential backoff).

Implement primarily in `src/emailQueue.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
