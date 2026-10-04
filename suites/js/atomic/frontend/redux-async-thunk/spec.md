Build a product list fetching via `createAsyncThunk`.

* **Status Display** (`data-testid="thunk-status"`): Displays `idle`, `loading`, `succeeded`, or `failed`.
* **List** (`data-testid="thunk-data-list"`).

Dispatch the thunk on mount (or via a load button) and wire pending/fulfilled/rejected into the slice status.
