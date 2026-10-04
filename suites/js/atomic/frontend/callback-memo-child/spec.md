Build a parent component passing a memoized callback to a child button component wrapped in `React.memo`.

* **Parent Counter** (`data-testid="parent-count"`).
* **Child Button** (`data-testid="child-action-btn"`).
* **Requirement**: Verify the child component does NOT re-render when parent state updates unrelated to the callback.
