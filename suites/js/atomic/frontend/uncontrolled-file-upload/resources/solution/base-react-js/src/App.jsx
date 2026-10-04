import { useRef, useState } from "react";

export function App() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    setFileName(file ? file.name : "");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input data-testid="file-input" type="file" ref={fileInputRef} />
      <button data-testid="upload-btn" type="submit">
        Upload
      </button>
      <p data-testid="file-name-display">{fileName}</p>
    </form>
  );
}
