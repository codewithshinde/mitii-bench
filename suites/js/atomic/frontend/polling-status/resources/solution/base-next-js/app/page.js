'use client';

import { useEffect, useState } from "react";

async function healthcheck() {
  return Math.random() > 0.2 ? "Healthy" : "Unreachable";
}

export default function Page() {
  const [status, setStatus] = useState("Healthy");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    let alive = true;
    const tick = async () => {
      const s = await healthcheck();
      if (alive) setStatus(s);
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => { alive = false; clearInterval(id); };
  }, [paused]);

  return (
    <div>
      <div data-testid="server-status">{status}</div>
      <button data-testid="pause-polling-btn" onClick={() => setPaused((p) => !p)}>
        {paused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}
