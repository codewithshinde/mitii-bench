Build a module that runs shell tasks asynchronously using `child_process.exec`.

* **Function**: `runSystemDiagnostics()`
* **Output**: Returns a Promise resolving to `{ stdout, stderr, exitCode }`.
* **Validation**: Timeout after 5 seconds if command hangs.

Implement primarily in `src/diagnostics.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
