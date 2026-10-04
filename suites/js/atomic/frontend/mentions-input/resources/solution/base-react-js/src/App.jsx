import { useMemo, useState } from "react";

const USERS = ["alice", "bob", "carol", "dave"];

export function App() {
  const [text, setText] = useState("");
  const mention = useMemo(() => {
    const m = text.match(/(?:^|\s)@([\w]*)$/);
    return m ? m[1] : null;
  }, [text]);

  const suggestions = mention !== null
    ? USERS.filter((u) => u.startsWith(mention.toLowerCase()))
    : [];

  const pick = (user) => {
    setText((t) => t.replace(/(?:^|\s)@([\w]*)$/, (full) => full.replace(/@[\w]*$/, "@" + user + " ")));
  };

  return (
    <div>
      <textarea data-testid="mention-input" value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      {suggestions.length > 0 && (
        <ul data-testid="mention-dropdown">
          {suggestions.map((u) => (
            <li key={u} onClick={() => pick(u)}>@{u}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
