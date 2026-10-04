Build an `withAuthorization` HOC that wraps a `Dashboard` component.

* **Props**: `role`.
* **Authorized View** (`data-testid="dashboard-view"`): Rendered if `role === 'admin'`.
* **Unauthorized View** (`data-testid="unauthorized-msg"`): Rendered if `role !== 'admin'`.
