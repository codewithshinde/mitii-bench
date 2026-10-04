Build a 2FA workflow using `speakeasy` and QR codes.

* **Endpoints**: `POST /2fa/generate` (returns QR secret), `POST /2fa/verify` (validates 6-digit TOTP token).

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
