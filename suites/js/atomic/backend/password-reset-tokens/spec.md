Build a secure password reset workflow.

* **Step 1**: Request reset -> Generate crypto token, store salted hash with 15-min expiration, send mock email link.
* **Step 2**: Submit new password + token -> Validate token, update password, invalidate token.

Implement primarily in `src/passwordReset.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
