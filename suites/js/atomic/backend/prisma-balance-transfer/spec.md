Build an e-commerce balance transfer using Prisma interactive transactions.

* **Function**: `transferBalance(fromUserId, toUserId, amount)`
* **Constraint**: Execute inside `prisma.$transaction()` ensuring atomicity.

Implement primarily in `src/transferBalance.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding. Install required packages: `prisma`, `@prisma/client`.
