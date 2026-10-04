Build an API Gateway reverse proxy endpoint using `http-proxy-middleware`.

* **Behavior**: Forward requests matching `/services/users/*` to the downstream User Microservice.
* **Target**: Proxy to `http://127.0.0.1:${process.env.USER_SERVICE_PORT}` (the harness provides `USER_SERVICE_PORT`).

Implement primarily in `src/index.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding. Install required packages: `http-proxy-middleware`.
