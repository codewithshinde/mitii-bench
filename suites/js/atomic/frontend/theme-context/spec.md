Build a light/dark theme provider and consumer.

* **Theme Provider**: Encloses the app state (`light` or `dark`).
* **Toggle Button** (`data-testid="theme-toggle"`).
* **Content Panel** (`data-testid="content-panel"`): Class or style shifts between light and dark backgrounds depending on Context value.

For `base-next-js`, implement the UI in `app/page.jsx` as a client component (`"use client"`).
