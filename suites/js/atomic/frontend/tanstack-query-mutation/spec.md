Build a comment submission form using TanStack Query `useMutation`.

* **Input** (`data-testid="comment-input"`).
* **Submit** (`data-testid="comment-submit"`).
* **Behavior**: Optimistically insert new comment into cached UI list before server responds.

Use `onMutate` / cache updates so the list reflects the new comment immediately.
