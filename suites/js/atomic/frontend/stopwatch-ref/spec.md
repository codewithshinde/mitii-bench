Build a basic stopwatch timer.

* **Timer Display** (`data-testid="timer-display"`): Shows elapsed time in seconds.
* **Start Button** (`data-testid="start-btn"`)
* **Stop Button** (`data-testid="stop-btn"`)
* **Implementation**: Store interval ID in a `useRef` so clears do not trigger unnecessary re-renders.
