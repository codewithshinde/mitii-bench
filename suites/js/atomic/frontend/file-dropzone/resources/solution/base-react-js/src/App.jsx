import { useState } from "react";

export function App() {
  const [active, setActive] = useState(false);
  const [files, setFiles] = useState([]);

  const onDrop = (e) => {
    e.preventDefault();
    setActive(false);
    const list = Array.from(e.dataTransfer.files).map((f) => ({ name: f.name, kb: (f.size / 1024).toFixed(1) }));
    setFiles((prev) => [...prev, ...list]);
  };

  return (
    <div>
      <div
        data-testid="dropzone"
        className={active ? "active" : ""}
        onDragOver={(e) => { e.preventDefault(); setActive(true); }}
        onDragLeave={() => setActive(false)}
        onDrop={onDrop}
        style={{ border: "2px dashed #888", padding: 24 }}
      >
        Drop files here
      </div>
      <ul data-testid="uploaded-file-list">
        {files.map((f, i) => <li key={i}>{f.name} — {f.kb} KB</li>)}
      </ul>
    </div>
  );
}
