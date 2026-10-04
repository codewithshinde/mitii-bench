Build an API for uploading large files in chunks.

* **Endpoints**: `POST /upload/init`, `POST /upload/chunk`, `POST /upload/complete`.
* **Behavior**: Merges byte chunks into a single file on completion.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
