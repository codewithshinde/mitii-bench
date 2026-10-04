Build a route guard wrapper component `RequireAuth` using React Router v6.

* **Behavior**: Redirects unauthenticated users to `/login`. Renders `<Outlet/>` if `isAuthenticated === true`.
* **Login View** (`data-testid="login-view"`): Shown at `/login` when unauthenticated.
* **Protected Content** (`data-testid="protected-view"`): Rendered via outlet when authenticated.

Provide a minimal auth toggle (or login control) so both the redirect and authenticated outlet paths can be exercised.
