Build a URL sanitizer utility using native `URL` and `URLSearchParams` classes.

* **Function**: `sanitizeRedirectUrl(rawUrl)`
* **Behavior**: Validates domain whitelist and strips tracked URL parameters (`utm_source`, `fbclid`).

Implement primarily in `src/sanitizeRedirectUrl.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
