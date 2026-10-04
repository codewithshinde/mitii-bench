Build a static file downloader utility.

* **Function**: `getPublicFile(userPath)`
* **Security Constraint**: Use `path.normalize` and verify requested path resides strictly inside target `/public` directory to block `../` path traversal attacks.

Implement primarily in `src/getPublicFile.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
