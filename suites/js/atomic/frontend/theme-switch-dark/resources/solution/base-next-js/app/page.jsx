'use client';

import { useEffect, useState } from "react";

export default function Page() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(localStorage.getItem("theme") === "dark");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div>
      <label>
        <input
          data-testid="theme-switch"
          type="checkbox"
          checked={dark}
          onChange={(e) => setDark(e.target.checked)}
        />
        Dark mode
      </label>
    </div>
  );
}
