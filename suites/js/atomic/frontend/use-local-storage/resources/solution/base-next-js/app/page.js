'use client';

import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) setValue(stored);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore quota errors in tests */
    }
  }, [key, value, hydrated]);

  return [value, setValue];
}

export default function Page() {
  const [text, setText] = useLocalStorage("persistent-input", "");

  return (
    <input
      data-testid="persistent-input"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}
