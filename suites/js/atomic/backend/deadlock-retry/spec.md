Build a database execution wrapper that detects SQL deadlock/serialization failure error codes (e.g., Postgres code `40001` or `40P01`) and retries query execution up to 3 times with jittered delays.

Implement primarily in `src/deadlockRetry.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
