Build a domain network diagnostic function using `node:dns/promises`.

* **Function**: `inspectDomain(domain)`
* **Output**: Returns JSON with IP addresses (`A` records), mail servers (`MX` records), and TXT entries.

Implement primarily in `src/inspectDomain.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
