'use client';

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [items, setItems] = useState(() => Array.from({ length: 10 }, (_, i) => "Item " + (i + 1)));
  const sentinel = useRef(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setItems((prev) => {
            const start = prev.length;
            return [...prev, ...Array.from({ length: 10 }, (_, i) => "Item " + (start + i + 1))];
          });
        }
      },
      { rootMargin: "100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div data-testid="infinite-feed" style={{ maxHeight: 320, overflow: "auto" }}>
      {items.map((item) => <div key={item} style={{ padding: 12, borderBottom: "1px solid #ddd" }}>{item}</div>)}
      <div ref={sentinel} style={{ height: 1 }} />
    </div>
  );
}
