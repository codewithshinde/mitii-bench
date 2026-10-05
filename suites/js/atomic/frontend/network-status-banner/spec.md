Build an internet connectivity monitoring banner.

* **Status Banner** (`data-testid="network-status-banner"`).
* **Behavior**: Listens to `window.addEventListener('offline')` and `window.addEventListener('online')` to show "You are offline" or "Connection restored".

For `base-react-js`, implement the UI in `src/App.jsx`.

For `base-next-js`, implement the UI in `app/page.jsx` as a client component (`"use client"`).
