Build a fetch wrapper accepting an `AbortSignal`.

* **Function**: `fetchWithTimeout(url, timeoutMs)`
* **Behavior**: Cancels downstream request and rejects Promise with `TimeoutError` if response takes longer than specified timeout.

Implement primarily in `src/fetchWithTimeout.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
