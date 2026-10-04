Build a permission evaluator service.

* **Function**: `canUserExecute(userId, action, resource)`
* **Evaluation**: Queries permissions matrix considering roles and direct user permission overrides.

Implement primarily in `src/rbac.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
