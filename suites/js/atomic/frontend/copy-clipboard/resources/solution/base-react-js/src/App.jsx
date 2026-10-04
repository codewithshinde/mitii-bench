import { useState } from "react";

const CODE = "console.log('hello');";

export function App() {
  const [label, setLabel] = useState("Copy");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
    } catch {
      /* ignore in non-secure contexts */
    }
    setLabel("Copied!");
    setTimeout(() => setLabel("Copy"), 2000);
  };

  return (
    <div>
      <pre data-testid="code-block">{CODE}</pre>
      <button data-testid="copy-btn" onClick={copy}>{label}</button>
    </div>
  );
}
