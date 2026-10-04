Build an incoming webhook handler (e.g., Stripe style).

* **Header**: `x-signature`
* **Validation**: Compute HMAC-SHA256 signature over raw request body using a shared secret and verify against header before processing payload.

Implement primarily in `src/webhook.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
