Build a route guard for Next.js App Router that protects authenticated pages (no react-router).

* **Behavior**: Redirects unauthenticated users to `/login`. Allows access to the protected view when `isAuthenticated === true`.
* **Login View** (`data-testid="login-view"`): Shown at `/login` when unauthenticated.
* **Protected Content** (`data-testid="protected-view"`): Rendered when authenticated.

Prefer a middleware redirect pattern and/or a server/client check with `redirect` from `next/navigation`. Provide a minimal auth toggle (or login page) so both paths can be exercised.
