'use client';

import { useState } from "react";

const COLS = ["To Do", "In Progress", "Done"];

export default function Page() {
  const [tasks, setTasks] = useState([
    { id: "t1", title: "Design", col: 0 },
    { id: "t2", title: "Implement", col: 1 },
    { id: "t3", title: "Ship", col: 2 },
  ]);

  const move = (id, dir) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const col = Math.min(2, Math.max(0, t.col + dir));
        return { ...t, col };
      })
    );
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {COLS.map((name, ci) => (
        <div key={name} style={{ flex: 1, border: "1px solid #ccc", padding: 8 }}>
          <h3>{name}</h3>
          {tasks.filter((t) => t.col === ci).map((t) => (
            <div key={t.id} data-testid={"task-card-" + t.id} style={{ border: "1px solid #aaa", marginBottom: 8, padding: 6 }}>
              <div>{t.title}</div>
              <button disabled={t.col === 0} onClick={() => move(t.id, -1)}>Move Left</button>
              <button disabled={t.col === 2} onClick={() => move(t.id, 1)}>Move Right</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
