Build an API client UI component that handles 401 Unauthorized globally.

* **Fetch Button** (`data-testid="axios-fetch-btn"`).
* **Error Handler** (`data-testid="global-auth-error"`): Displays "Session Expired" when Axios interceptor catches a 401 response.

Register an Axios response interceptor that detects status 401 and surfaces the global error UI.
