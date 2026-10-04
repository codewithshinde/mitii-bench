Build a URL shortener system.

* **Endpoints**: `POST /shorten`, `GET /:code` (redirects to long URL and asynchronously increments click metrics in DB).

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
