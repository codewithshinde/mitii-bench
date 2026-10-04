import { useState } from "react";

export function App() {
  const [step, setStep] = useState(2);

  const stateOf = (n) => (n < step ? "completed" : n === step ? "active" : "pending");

  return (
    <div>
      <div data-testid="stepper" style={{ display: "flex", gap: 12 }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} data-testid={"step-node-" + n} data-state={stateOf(n)} style={{ opacity: stateOf(n) === "pending" ? 0.5 : 1, fontWeight: stateOf(n) === "active" ? "bold" : "normal" }}>
            Step {n} ({stateOf(n)})
          </div>
        ))}
      </div>
      <button disabled={step <= 1} onClick={() => setStep((s) => s - 1)}>Back</button>
      <button disabled={step >= 4} onClick={() => setStep((s) => s + 1)}>Next</button>
    </div>
  );
}
