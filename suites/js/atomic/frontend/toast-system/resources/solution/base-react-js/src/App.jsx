import { useState } from "react";

export function App() {
  const [toasts, setToasts] = useState([]);

  const push = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500);
  };

  return (
    <div>
      <button data-testid="btn-toast-success" onClick={() => push("success", "Success")}>Show Success Toast</button>
      <button data-testid="btn-toast-error" onClick={() => push("error", "Error")}>Show Error Toast</button>
      <div data-testid="toast-container">
        {toasts.map((t) => (
          <div key={t.id} style={{ color: t.type === "error" ? "crimson" : "green" }}>{t.message}</div>
        ))}
      </div>
    </div>
  );
}
