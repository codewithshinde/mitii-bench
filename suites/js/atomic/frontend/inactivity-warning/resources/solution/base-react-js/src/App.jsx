import { useEffect, useRef, useState } from "react";

const IDLE_MS = 60000;

export function App() {
  const [warn, setWarn] = useState(false);
  const timer = useRef(null);

  const reset = () => {
    setWarn(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setWarn(true), IDLE_MS);
  };

  useEffect(() => {
    reset();
    const events = ["mousemove", "keypress", "keydown", "click"];
    events.forEach((ev) => window.addEventListener(ev, reset));
    return () => {
      clearTimeout(timer.current);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, []);

  return (
    <div>
      <p>Active session</p>
      {warn && (
        <div data-testid="inactivity-modal" role="dialog">
          <p>You have been inactive.</p>
          <button data-testid="stay-active-btn" onClick={reset}>Stay Logged In</button>
        </div>
      )}
    </div>
  );
}
