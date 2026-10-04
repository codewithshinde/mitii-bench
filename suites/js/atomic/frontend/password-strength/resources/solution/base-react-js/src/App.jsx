import { useMemo, useState } from "react";

function score(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return "Weak";
  if (s <= 3) return "Medium";
  return "Strong";
}

export function App() {
  const [pw, setPw] = useState("");
  const strength = useMemo(() => (pw ? score(pw) : ""), [pw]);

  return (
    <div>
      <input data-testid="password-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
      <div data-testid="strength-meter">{strength || "—"}</div>
    </div>
  );
}
