import { useEffect, useRef, useState } from "react";

export function App() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function start() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }

  function stop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  return (
    <div>
      <span data-testid="timer-display">{seconds}</span>
      <button data-testid="start-btn" onClick={start}>
        Start
      </button>
      <button data-testid="stop-btn" onClick={stop}>
        Stop
      </button>
    </div>
  );
}
