import { useState } from "react";

export function App() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [idRef, setIdRef] = useState(1);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    setTodos((prev) => [...prev, { id: idRef, text: t, complete: false }]);
    setIdRef((n) => n + 1);
    setText("");
  };

  const saveEdit = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: editText.trim() || t.text } : t)));
    setEditingId(null);
  };

  return (
    <div>
      <input data-testid="todo-input" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
      <button data-testid="add-todo-btn" onClick={add}>Add</button>
      <ul data-testid="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.complete ? "line-through" : "none" }}>
            <input
              type="checkbox"
              data-testid={"todo-check-" + todo.id}
              checked={todo.complete}
              onChange={() => setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, complete: !t.complete } : t)))}
            />
            {editingId === todo.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => saveEdit(todo.id)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => { setEditingId(todo.id); setEditText(todo.text); }}>{todo.text}</span>
            )}
            <button data-testid={"todo-delete-" + todo.id} onClick={() => setTodos((prev) => prev.filter((t) => t.id !== todo.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
