Build a memory leak detection utility using `v8` module.

* **Function**: `checkHeapLimits()`
* **Behavior**: Evaluates `v8.getHeapStatistics()` and logs warning if heap memory usage exceeds 85%.

Implement primarily in `src/heapLimits.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
