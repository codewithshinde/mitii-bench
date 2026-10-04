Build a batching loader using `dataloader`.

* **Problem**: Prevent N+1 SQL queries when fetching authors for a list of posts.

### CLI & Utility Packages (Commander, Pino, Winston)

Implement primarily in `src/loaders/authorLoader.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding. Install required packages: `dataloader`.
