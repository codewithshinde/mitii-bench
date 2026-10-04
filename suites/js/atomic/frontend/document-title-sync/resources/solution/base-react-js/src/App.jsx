import { useEffect, useState } from "react";

export function App() {
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
