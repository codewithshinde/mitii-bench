Build an append-only event store module.

* **Methods**: `appendEvent(streamId, eventType, data)`, `getStream(streamId)`. Reconstructs current state by replaying events.

Implement primarily in `src/eventStore.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
