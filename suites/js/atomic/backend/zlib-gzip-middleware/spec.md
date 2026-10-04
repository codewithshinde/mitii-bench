Build an HTTP response compression pipeline using `zlib.createGzip()`.

* **Middleware**: Intercepts response body stream and compresses with Gzip if client sends `Accept-Encoding: gzip`.

Implement primarily in `src/gzipMiddleware.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
