Build a file logger utility.

* **Function**: `appendLog(filename, message)`
* **Behavior**: Appends timestamped logs. If file size exceeds 1MB, renames file to `filename.old` and starts a new file.

Implement primarily in `src/logRotator.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
