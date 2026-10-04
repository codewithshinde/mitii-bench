'use client';

import { useRef, useState } from "react";

export default function Page() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef([]);

  const setAt = (i, val) => {
    const d = val.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <div>
      {digits.map((d, i) => (
        <input
          key={i}
          data-testid={"otp-input-" + i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          maxLength={1}
          onChange={(e) => setAt(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          style={{ width: 32, textAlign: "center", marginRight: 4 }}
        />
      ))}
    </div>
  );
}
