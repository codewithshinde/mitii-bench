Build a component wrapped in a React Error Boundary.

* **Buggy Component Button** (`data-testid="crash-btn"`): Throws an Error on click.
* **Fallback UI** (`data-testid="error-fallback"`): Renders "Something went wrong" when an error is caught by boundary.

For `base-next-js`, implement the UI in `app/page.jsx` as a client component (`"use client"`).
