Build a log/export sanitizer module that recurses through objects and masks sensitive keys (`ssn`, `creditCard`, `password`) with `***REDACTED***`.

Implement primarily in `src/maskSensitive.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
