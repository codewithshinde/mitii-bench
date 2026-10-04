Build an infinite loading content feed.

* **Feed List** (`data-testid="infinite-feed"`).
* **Trigger**: Fetch and append 10 more items when scrolling reaches within 100px of the bottom (via `IntersectionObserver`).

For `base-next-js`, implement the UI in `app/page.jsx` as a client component (`"use client"`).
