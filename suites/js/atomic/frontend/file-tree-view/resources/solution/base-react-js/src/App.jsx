import { useState } from "react";

const TREE = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      { id: "app", name: "App.jsx", type: "file" },
      { id: "utils", name: "utils", type: "folder", children: [{ id: "helpers", name: "helpers.js", type: "file" }] },
    ],
  },
  { id: "readme", name: "README.md", type: "file" },
];

function Node({ node, depth }) {
  const [open, setOpen] = useState(true);
  if (node.type === "file") {
    return (
      <div data-testid={"file-" + node.id} style={{ paddingLeft: depth * 16 }}>
        📄 {node.name}
      </div>
    );
  }
  return (
    <div>
      <div data-testid={"folder-" + node.id} style={{ paddingLeft: depth * 16, cursor: "pointer" }} onClick={() => setOpen((o) => !o)}>
        {open ? "📂" : "📁"} {node.name}
      </div>
      {open && (node.children || []).map((c) => <Node key={c.id} node={c} depth={depth + 1} />)}
    </div>
  );
}

export function App() {
  return (
    <div>
      {TREE.map((n) => <Node key={n.id} node={n} depth={0} />)}
    </div>
  );
}
