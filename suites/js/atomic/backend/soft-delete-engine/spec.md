Build an abstraction layer or ORM plugin automatically transforming `delete` commands into soft updates (`deleted_at = NOW()`) and filtering them out of standard `find` queries.

Implement primarily in `src/softDelete.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
