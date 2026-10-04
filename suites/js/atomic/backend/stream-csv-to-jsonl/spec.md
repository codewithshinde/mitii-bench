Build a large CSV line processor using `stream.Transform`.

* **Input**: Readable stream of a 500MB CSV.
* **Output**: Transform stream converting rows to JSON lines (`.jsonl`) without buffering the entire file in RAM.

Implement primarily in `src/csvTransform.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
