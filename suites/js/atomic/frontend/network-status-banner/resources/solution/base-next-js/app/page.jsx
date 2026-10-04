'use client';

import { useEffect, useState } from "react";

export default function Page() {
  const [msg, setMsg] = useState(navigator.onLine ? "Connection restored" : "You are offline");

  useEffect(() => {
    const onOffline = () => setMsg("You are offline");
    const onOnline = () => setMsg("Connection restored");
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return (
    <div data-testid="network-status-banner" style={{ padding: 12, background: msg.includes("offline") ? "#fee" : "#efe" }}>
      {msg}
    </div>
  );
}
