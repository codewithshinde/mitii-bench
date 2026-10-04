Build custom session management middleware.

* **Behavior**: Encrypts session data in HTTP-only, SameSite=Strict, Secure cookies using AES-256-GCM.

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
