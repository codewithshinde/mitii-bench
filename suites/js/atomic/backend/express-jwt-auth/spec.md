Build a route protection middleware validating Bearer JWTs.

* **Middleware**: `authenticateToken(req, res, next)`
* **Behavior**: Verifies JWT signature using `jsonwebtoken`. Populates `req.user` or returns `401 Unauthorized`.

Implement primarily in `src/authenticateToken.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding. Install required packages: `jsonwebtoken`.
