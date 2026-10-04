'use client';

import { useEffect, useState } from "react";

export default function Page() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(localStorage.getItem("cookies_accepted") !== "true");
  }, []);

  const accept = () => {
    localStorage.setItem("cookies_accepted", "true");
    setVisible(false);
  };

  if (!visible) return <div>Thanks for accepting cookies.</div>;

  return (
    <div data-testid="cookie-banner" style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: 16, background: "#222", color: "#fff" }}>
      <p>We use cookies to improve your experience.</p>
      <button data-testid="accept-cookies-btn" onClick={accept}>Accept</button>
    </div>
  );
}
