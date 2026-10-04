Build a storage driver abstraction interface with two implementations: `LocalStorageProvider` and `S3StorageProvider` sharing a common interface (`upload`, `delete`, `getUrl`).

Implement primarily in `src/storage.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
