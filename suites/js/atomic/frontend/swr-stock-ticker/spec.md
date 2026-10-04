Build a live stock ticker display using SWR.

* **Ticker Display** (`data-testid="stock-price"`).
* **Refresh Status** (`data-testid="swr-validating"`): Shows "Updating..." when `isValidating` is true.

Use the `swr` hook with a fetcher; enable refresh/revalidation so `isValidating` can become true.
