Build a dual-package entry point utility library supporting both CommonJS (`require`) and ES Modules (`import`).

* **Export**: Function `formatCurrency(val)`.
* **Criteria**: Valid package configuration via `package.json` `exports` map (`import` vs `require`).

Implement primarily in `package.json` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
