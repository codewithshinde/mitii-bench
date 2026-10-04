'use client';

import { useEffect, useState } from "react";

export default function Page() {
  const [title, setTitle] = useState("");

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <input
      data-testid="title-input"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
}
