import { memo, useCallback, useState } from "react";

const ChildButton = memo(function ChildButton({ onAction }) {
  return (
    <button data-testid="child-action-btn" onClick={onAction}>
      Child Action
    </button>
  );
});

export function App() {
  const [count, setCount] = useState(0);
  const [clicks, setClicks] = useState(0);

  const handleAction = useCallback(() => {
    setClicks((c) => c + 1);
  }, []);

  return (
    <div>
      <span data-testid="parent-count">{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>Inc parent</button>
      <ChildButton onAction={handleAction} />
      <span>Child clicks: {clicks}</span>
    </div>
  );
}
