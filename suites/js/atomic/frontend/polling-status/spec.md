Build a real-time server status polling component.

* **Status Indicator** (`data-testid="server-status"`).
* **Behavior**: Calls mock healthcheck endpoint every 5 seconds. Displays "Healthy" or "Unreachable".
* **Pause Toggle** (`data-testid="pause-polling-btn"`): Temporarily halts interval.

For `base-next-js`, implement the UI in `app/page.jsx` as a client component (`"use client"`).
