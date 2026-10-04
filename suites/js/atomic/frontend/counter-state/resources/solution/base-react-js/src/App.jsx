import { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div data-testid="counter-container">
      <span data-testid="count-display">{count}</span>
      <button data-testid="increment-btn" onClick={() => setCount((c) => c + 1)}>
        +
      </button>
      <button
        data-testid="decrement-btn"
        onClick={() => setCount((c) => Math.max(0, c - 1))}
      >
        -
      </button>
      <button data-testid="reset-btn" onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
