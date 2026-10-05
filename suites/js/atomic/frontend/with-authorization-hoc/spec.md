Build an `withAuthorization` HOC that wraps a `Dashboard` component.

* **Props**: `role`.
* **Authorized View** (`data-testid="dashboard-view"`): Rendered if `role === 'admin'`.
* **Unauthorized View** (`data-testid="unauthorized-msg"`): Rendered if `role !== 'admin'`.

For `base-react-js`, implement the UI in `src/App.jsx`.

For `base-next-js`, implement the UI in `app/page.jsx` as a client component (`"use client"`).
