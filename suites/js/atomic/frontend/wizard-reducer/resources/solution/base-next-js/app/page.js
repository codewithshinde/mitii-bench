'use client';

import { useReducer } from "react";

const TOTAL = 4;

function reducer(state, action) {
  switch (action.type) {
    case "NEXT_STEP":
      return { step: Math.min(TOTAL, state.step + 1) };
    case "PREV_STEP":
      return { step: Math.max(1, state.step - 1) };
    case "RESET":
      return { step: 1 };
    default:
      return state;
  }
}

export default function Page() {
  const [state, dispatch] = useReducer(reducer, { step: 1 });

  return (
    <div>
      <p data-testid="step-display">
        Step {state.step} of {TOTAL}
      </p>
      <button
        data-testid="prev-btn"
        onClick={() => dispatch({ type: "PREV_STEP" })}
      >
        Prev
      </button>
      <button
        data-testid="next-btn"
        onClick={() => dispatch({ type: "NEXT_STEP" })}
      >
        Next
      </button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
    </div>
  );
}
