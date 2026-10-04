'use client';

import { useState } from "react";

export default function Page() {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [flip, setFlip] = useState(false);

  return (
    <div>
      <label>Card Number <input value={number} onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 16))} onFocus={() => setFlip(false)} /></label>
      <label>Expiry <input value={expiry} onChange={(e) => setExpiry(e.target.value.slice(0, 5))} onFocus={() => setFlip(false)} placeholder="MM/YY" /></label>
      <label>CVV <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} onFocus={() => setFlip(true)} /></label>
      <div data-testid="visual-card" style={{ marginTop: 16, padding: 16, background: "#1a3a5c", color: "#fff", borderRadius: 12, minHeight: 120 }}>
        {flip ? (
          <div>CVV: {cvv || "***"}</div>
        ) : (
          <div>
            <div>{(number || "•••• •••• •••• ••••").replace(/(\d{4})(?=\d)/g, "$1 ").trim()}</div>
            <div>Exp {expiry || "MM/YY"}</div>
          </div>
        )}
      </div>
    </div>
  );
}
