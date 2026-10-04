Build a order processing pipeline using `events.EventEmitter`.

* **Events**: `order:created`, `order:paid`, `order:shipped`.
* **Behavior**: Listeners trigger email notification mock functions when each step completes.

Implement primarily in `src/orderPipeline.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
