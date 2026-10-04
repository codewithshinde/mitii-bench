import { useMemo, useState } from "react";

function toHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let inList = false;
  for (const line of lines) {
    let l = line;
    if (/^###\s/.test(l)) { if (inList) { out.push("</ul>"); inList = false; } out.push("<h3>" + l.slice(4) + "</h3>"); continue; }
    if (/^##\s/.test(l)) { if (inList) { out.push("</ul>"); inList = false; } out.push("<h2>" + l.slice(3) + "</h2>"); continue; }
    if (/^#\s/.test(l)) { if (inList) { out.push("</ul>"); inList = false; } out.push("<h1>" + l.slice(2) + "</h1>"); continue; }
    if (/^-\s/.test(l)) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push("<li>" + l.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") + "</li>");
      continue;
    }
    if (inList) { out.push("</ul>"); inList = false; }
    if (l.trim()) out.push("<p>" + l.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") + "</p>");
  }
  if (inList) out.push("</ul>");
  return out.join("");
}

export function App() {
  const [md, setMd] = useState("# Hello\n\n**Bold** text\n\n- Item one\n- Item two");
  const html = useMemo(() => toHtml(md), [md]);
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <textarea data-testid="markdown-input" value={md} onChange={(e) => setMd(e.target.value)} rows={12} style={{ flex: 1 }} />
      <div data-testid="markdown-preview" style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
