import { useEffect, useState } from "react";

const TARGET = Date.now() + 1000 * 60 * 60 * 24 + 5000;

function parts(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds, done: ms <= 0 };
}

export function App() {
  const [left, setLeft] = useState(() => parts(TARGET - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setLeft(parts(TARGET - Date.now())), 250);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {!left.done ? (
        <div data-testid="countdown-display">
          {left.days} Days {left.hours} Hours {left.minutes} Minutes {left.seconds} Seconds
        </div>
      ) : (
        <div data-testid="event-launched-msg">Event launched!</div>
      )}
    </div>
  );
}
