Build a Knex.js database migration file.

* **Up**: Create table `orders` (id, user_id, total, status, created_at).
* **Down**: Drop table `orders`.

### WebSockets & Real-Time (Socket.io)

Implement primarily in `migrations/001_orders.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
