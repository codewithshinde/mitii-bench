Build a custom stream class extending `stream.Readable`.

* **Class**: `RandomDataStream`
* **Behavior**: Emits random integer chunks on demand adhering to backpressure (`this.push()`).

Implement primarily in `src/RandomDataStream.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
