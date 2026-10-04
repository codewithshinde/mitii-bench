Build a token pair issuer and refresher utility using `jose` or `jsonwebtoken`.

* **Endpoints**:
* `POST /token/refresh`
* **Behavior**: Validates long-lived refresh token, revokes old refresh token, and issues new Access + Refresh token pair.



### GraphQL (Apollo Server)

Implement primarily in `src/tokens.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
