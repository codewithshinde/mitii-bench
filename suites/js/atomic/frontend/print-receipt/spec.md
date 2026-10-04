Build an invoice preview view with print trigger.

* **Invoice Container** (`data-testid="invoice-view"`).
* **Print Button** (`data-testid="print-btn"`): Triggers `window.print()` and applies `@media print` CSS overrides.

For `base-next-js`, implement the UI in `app/page.jsx` as a client component (`"use client"`).
