'use client';

export default function Page() {
  const run = (cmd) => {
    document.execCommand(cmd, false, null);
  };

  return (
    <div>
      <div>
        <button data-testid="btn-bold" onMouseDown={(e) => { e.preventDefault(); run("bold"); }}>Bold</button>
        <button data-testid="btn-italic" onMouseDown={(e) => { e.preventDefault(); run("italic"); }}>Italic</button>
        <button data-testid="btn-underline" onMouseDown={(e) => { e.preventDefault(); run("underline"); }}>Underline</button>
      </div>
      <div data-testid="editor-area" contentEditable suppressContentEditableWarning style={{ minHeight: 120, border: "1px solid #ccc", padding: 8 }}>
        Edit me
      </div>
    </div>
  );
}
