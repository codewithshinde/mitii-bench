Build a startup configuration validator parsing `process.env`.

* **Requirement**: Throw descriptive error on process start if critical env variables (`DATABASE_URL`, `PORT`) are missing or malformed.

Implement primarily in `src/config.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
