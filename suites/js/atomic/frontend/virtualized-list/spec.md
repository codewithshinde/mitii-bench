Build a virtualized list for 10,000 items.

* **List Container** (`data-testid="virtual-list"`).
* **Render Check**: Verify only visible DOM nodes (~10-15 elements) exist in the DOM at any scroll position.

Use `react-window` (or react-virtualized) so off-screen rows are not mounted.
