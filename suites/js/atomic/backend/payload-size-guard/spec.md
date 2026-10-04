Build a streaming payload size validator middleware that aborts request connection immediately if streamed payload exceeds maximum byte threshold prior to loading full body.

Implement primarily in `src/payloadGuard.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
