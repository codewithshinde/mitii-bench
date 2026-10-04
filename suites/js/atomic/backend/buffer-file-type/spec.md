Build an image header inspector using `Buffer`.

* **Function**: `detectFileType(buffer)`
* **Behavior**: Reads magic bytes in raw Buffer (e.g., `89 50 4E 47` for PNG) and returns string file extension.

Implement primarily in `src/detectFileType.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
