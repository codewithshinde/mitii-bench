'use client';

import { useState } from "react";

function Comment({ node, onReply, depth }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  return (
    <div data-testid={"comment-" + node.id} style={{ paddingLeft: depth * 16, marginTop: 8 }}>
      <p>{node.text}</p>
      <button data-testid={"reply-btn-" + node.id} onClick={() => setOpen((o) => !o)}>Reply</button>
      {open && (
        <div>
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={() => { if (text.trim()) { onReply(node.id, text.trim()); setText(""); setOpen(false); } }}>Post</button>
        </div>
      )}
      {(node.replies || []).map((c) => (
        <Comment key={c.id} node={c} onReply={onReply} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function Page() {
  const [tree, setTree] = useState([{ id: "c1", text: "Root comment", replies: [] }]);
  const [next, setNext] = useState(2);

  const addReply = (parentId, text) => {
    const id = "c" + next;
    setNext((n) => n + 1);
    const insert = (nodes) =>
      nodes.map((n) =>
        n.id === parentId
          ? { ...n, replies: [...(n.replies || []), { id, text, replies: [] }] }
          : { ...n, replies: insert(n.replies || []) }
      );
    setTree((t) => insert(t));
  };

  return (
    <div>
      {tree.map((n) => <Comment key={n.id} node={n} onReply={addReply} depth={0} />)}
    </div>
  );
}
