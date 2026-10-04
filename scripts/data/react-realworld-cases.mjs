// Auto-generated React real-world cases (prompts 56–99).
// Vanilla React 18 only — no external npm packages.

export const realworldCases = [
  {
    slug: "todo-crud",
    title: "Todo List (CRUD Operations)",
    difficulty: "medium",
    tags: ["todo","crud","forms","list"],
    prompt: `Build a complete Todo application.

* **Input** (\`data-testid="todo-input"\`) and **Add** (\`data-testid="add-todo-btn"\`).
* **List** (\`data-testid="todo-list"\`).
* **Items**:
  * Checkbox (\`data-testid="todo-check-[id]"\`) to toggle complete.
  * Delete Button (\`data-testid="todo-delete-[id]"\`) to remove.
  * Double click item text to convert to inline edit mode.`,
    testids: ["todo-input","add-todo-btn","todo-list","todo-check-","todo-delete-"],
    markers: ["todo-check-","todo-delete-","onDoubleClick","complete"],
    reactSolution: `import { useState } from "react";

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
`,
  },
  {
    slug: "debounced-autocomplete",
    title: "Search Bar with Live Debounced Auto-Complete",
    difficulty: "medium",
    tags: ["search","debounce","autocomplete","keyboard"],
    prompt: `Build a dynamic search box that queries a mock database.

* **Input** (\`data-testid="search-input"\`).
* **Dropdown Suggestions** (\`data-testid="search-suggestions"\`): Displays filtered items after 300ms idle typing.
* **Keyboard Navigation**: Pressing \`ArrowDown\`/\`ArrowUp\` navigates suggestions; \`Enter\` selects.`,
    testids: ["search-input","search-suggestions"],
    markers: ["ArrowDown","ArrowUp","300","debounce"],
    reactSolution: `import { useEffect, useMemo, useState } from "react";

const DB = ["Apple", "Apricot", "Banana", "Blueberry", "Cherry", "Grape", "Mango", "Orange", "Peach", "Pear"];

export function App() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [active, setActive] = useState(-1);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const suggestions = useMemo(() => {
    if (!debounced.trim()) return [];
    return DB.filter((x) => x.toLowerCase().includes(debounced.toLowerCase()));
  }, [debounced]);

  const onKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      setSelected(suggestions[active]);
      setQuery(suggestions[active]);
      setActive(-1);
    }
  };

  return (
    <div>
      <input data-testid="search-input" value={query} onChange={(e) => { setQuery(e.target.value); setActive(-1); }} onKeyDown={onKeyDown} />
      {suggestions.length > 0 && (
        <ul data-testid="search-suggestions">
          {suggestions.map((s, i) => (
            <li key={s} style={{ background: i === active ? "#def" : "transparent" }} onMouseDown={() => { setSelected(s); setQuery(s); }}>
              {s}
            </li>
          ))}
        </ul>
      )}
      {selected && <p>Selected: {selected}</p>}
    </div>
  );
}
`,
  },
  {
    slug: "registration-wizard",
    title: "Multi-Step Registration Wizard",
    difficulty: "medium",
    tags: ["wizard","forms","multi-step"],
    prompt: `Build a 3-step sign-up flow.

* **Step 1**: Personal Info (Name, Email).
* **Step 2**: Account Details (Username, Password).
* **Step 3**: Confirmation Summary (\`data-testid="wizard-summary"\`).
* **Controls**: Next (\`data-testid="wizard-next"\`), Back (\`data-testid="wizard-back"\`). Preserve input state across steps.`,
    testids: ["wizard-summary","wizard-next","wizard-back"],
    markers: ["Name","Email","Username","Password","wizard-summary"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      {step === 1 && (
        <div>
          <label>Name <input value={form.name} onChange={set("name")} /></label>
          <label>Email <input value={form.email} onChange={set("email")} /></label>
        </div>
      )}
      {step === 2 && (
        <div>
          <label>Username <input value={form.username} onChange={set("username")} /></label>
          <label>Password <input type="password" value={form.password} onChange={set("password")} /></label>
        </div>
      )}
      {step === 3 && (
        <div data-testid="wizard-summary">
          <p>Name: {form.name}</p>
          <p>Email: {form.email}</p>
          <p>Username: {form.username}</p>
        </div>
      )}
      <div>
        <button data-testid="wizard-back" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>Back</button>
        <button data-testid="wizard-next" disabled={step === 3} onClick={() => setStep((s) => s + 1)}>Next</button>
      </div>
    </div>
  );
}
`,
  },
  {
    slug: "data-table-controls",
    title: "Data Table with Pagination, Sorting & Filtering",
    difficulty: "hard",
    tags: ["table","pagination","filter","sort"],
    prompt: `Build an enterprise data table.

* **Controls**:
  * Global Search Filter (\`data-testid="table-search"\`).
  * Page Size Select (\`data-testid="page-size-select"\`).
  * Next/Prev Page Buttons (\`data-testid="next-page"\`, \`data-testid="prev-page"\`).
* **Display** (\`data-testid="page-indicator"\`): "Page X of Y".`,
    testids: ["table-search","page-size-select","next-page","prev-page","page-indicator"],
    markers: ["Page "," of "],
    reactSolution: `import { useMemo, useState } from "react";

const ROWS = Array.from({ length: 47 }, (_, i) => ({ id: i + 1, name: "User " + (i + 1), email: "user" + (i + 1) + "@ex.com" }));

export function App() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ROWS.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div>
      <input data-testid="table-search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      <select data-testid="page-size-select" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
        {[5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th></tr></thead>
        <tbody>
          {slice.map((r) => <tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.email}</td></tr>)}
        </tbody>
      </table>
      <button data-testid="prev-page" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
      <span data-testid="page-indicator">Page {safePage} of {totalPages}</span>
      <button data-testid="next-page" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}
`,
  },
  {
    slug: "file-dropzone",
    title: "File Drag-and-Drop Uploader",
    difficulty: "medium",
    tags: ["drag-drop","files","upload"],
    prompt: `Build a custom drag-and-drop file dropzone.

* **Dropzone Area** (\`data-testid="dropzone"\`).
* **State Changes**: Add \`active\` class when a file is dragged over dropzone.
* **File List** (\`data-testid="uploaded-file-list"\`): Shows dropped file names and sizes in KB.`,
    testids: ["dropzone","uploaded-file-list"],
    markers: ["active","KB","onDragOver","onDrop"],
    reactSolution: `import { useState } from "react";

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
`,
  },
  {
    slug: "image-carousel",
    title: "Image Carousel / Gallery Slider",
    difficulty: "easy",
    tags: ["carousel","slider","images"],
    prompt: `Build a manual image slider.

* **Image Frame** (\`data-testid="carousel-image"\`).
* **Prev/Next Controls** (\`data-testid="carousel-prev"\`, \`data-testid="carousel-next"\`).
* **Indicators** (\`data-testid="carousel-dot-[index]"\`): Highlights active slide indicator.`,
    testids: ["carousel-image","carousel-prev","carousel-next","carousel-dot-"],
    markers: ["carousel-dot-"],
    reactSolution: `import { useState } from "react";

const IMAGES = [
  "https://via.placeholder.com/400x200?text=Slide+1",
  "https://via.placeholder.com/400x200?text=Slide+2",
  "https://via.placeholder.com/400x200?text=Slide+3",
];

export function App() {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i === 0 ? IMAGES.length - 1 : i - 1));
  const next = () => setIndex((i) => (i + 1) % IMAGES.length);

  return (
    <div>
      <img data-testid="carousel-image" src={IMAGES[index]} alt={"Slide " + (index + 1)} />
      <button data-testid="carousel-prev" onClick={prev}>Prev</button>
      <button data-testid="carousel-next" onClick={next}>Next</button>
      <div>
        {IMAGES.map((_, i) => (
          <button
            key={i}
            data-testid={"carousel-dot-" + i}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            style={{ fontWeight: i === index ? "bold" : "normal" }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
`,
  },
  {
    slug: "infinite-scroll-feed",
    title: "Infinite Scroll Feed",
    difficulty: "medium",
    tags: ["infinite-scroll","IntersectionObserver","feed"],
    prompt: `Build an infinite loading content feed.

* **Feed List** (\`data-testid="infinite-feed"\`).
* **Trigger**: Fetch and append 10 more items when scrolling reaches within 100px of the bottom (via \`IntersectionObserver\`).`,
    testids: ["infinite-feed"],
    markers: ["IntersectionObserver","rootMargin"],
    reactSolution: `import { useEffect, useRef, useState } from "react";

export function App() {
  const [items, setItems] = useState(() => Array.from({ length: 10 }, (_, i) => "Item " + (i + 1)));
  const sentinel = useRef(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setItems((prev) => {
            const start = prev.length;
            return [...prev, ...Array.from({ length: 10 }, (_, i) => "Item " + (start + i + 1))];
          });
        }
      },
      { rootMargin: "100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div data-testid="infinite-feed" style={{ maxHeight: 320, overflow: "auto" }}>
      {items.map((item) => <div key={item} style={{ padding: 12, borderBottom: "1px solid #ddd" }}>{item}</div>)}
      <div ref={sentinel} style={{ height: 1 }} />
    </div>
  );
}
`,
  },
  {
    slug: "accessible-modal",
    title: "Modal Dialog with Keyboard Accessibility",
    difficulty: "medium",
    tags: ["modal","a11y","focus-trap","keyboard"],
    prompt: `Build an accessible popup modal.

* **Modal Container** (\`data-testid="accessible-modal"\`).
* **Behavior**:
  * Pressing \`Esc\` key closes modal.
  * Tab navigation trapped within modal elements while open.`,
    testids: ["accessible-modal"],
    markers: ["Escape","Tab","focus"],
    reactSolution: `import { useEffect, useRef, useState } from "react";

export function App() {
  const [open, setOpen] = useState(false);
  const firstRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    firstRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const focusables = [firstRef.current, lastRef.current].filter(Boolean);
        if (!focusables.length) return;
        if (e.shiftKey && document.activeElement === firstRef.current) {
          e.preventDefault();
          lastRef.current.focus();
        } else if (!e.shiftKey && document.activeElement === lastRef.current) {
          e.preventDefault();
          firstRef.current.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      {open && (
        <div data-testid="accessible-modal" role="dialog" aria-modal="true">
          <h2>Accessible Modal</h2>
          <button ref={firstRef} onClick={() => {}}>Action</button>
          <button ref={lastRef} onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
`,
  },
  {
    slug: "shopping-cart",
    title: "Shopping Cart with Quantity Modifiers & Total Summary",
    difficulty: "medium",
    tags: ["cart","ecommerce","quantity"],
    prompt: `Build an e-commerce shopping cart view.

* **Cart Rows** (\`data-testid="cart-item-[id]"\`):
  * Quantity Increment (\`data-testid="inc-[id]"\`)/Decrement (\`data-testid="dec-[id]"\`).
  * Line Total Display (\`data-testid="line-total-[id]"\`).
* **Grand Total** (\`data-testid="grand-total"\`): Sum of all line items.`,
    testids: ["cart-item-","inc-","dec-","line-total-","grand-total"],
    markers: ["grand-total","line-total-"],
    reactSolution: `import { useMemo, useState } from "react";

export function App() {
  const [items, setItems] = useState([
    { id: "a1", name: "Widget", price: 10, qty: 1 },
    { id: "b2", name: "Gadget", price: 25, qty: 2 },
  ]);

  const update = (id, delta) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it)));
  };

  const grand = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);

  return (
    <div>
      {items.map((it) => (
        <div key={it.id} data-testid={"cart-item-" + it.id}>
          <span>{it.name}</span>
          <button data-testid={"dec-" + it.id} onClick={() => update(it.id, -1)}>-</button>
          <span>{it.qty}</span>
          <button data-testid={"inc-" + it.id} onClick={() => update(it.id, 1)}>+</button>
          <span data-testid={"line-total-" + it.id}>{it.price * it.qty}</span>
        </div>
      ))}
      <div data-testid="grand-total">{grand}</div>
    </div>
  );
}
`,
  },
  {
    slug: "star-rating",
    title: "Rating Component (Star Rating)",
    difficulty: "easy",
    tags: ["rating","stars","hover"],
    prompt: `Build an interactive star rating component.

* **Stars** (\`data-testid="star-[1-5]"\`).
* **Hover State**: Highlights stars up to hovered index.
* **Click State**: Sets permanent rating value (\`data-testid="selected-rating"\`).`,
    testids: ["star-","selected-rating"],
    markers: ["selected-rating","onMouseEnter"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const shown = hover || rating;

  return (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          data-testid={"star-" + n}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => setRating(n)}
          style={{ color: n <= shown ? "gold" : "#ccc", fontSize: 28, background: "none", border: "none" }}
        >
          ★
        </button>
      ))}
      <div data-testid="selected-rating">{rating}</div>
    </div>
  );
}
`,
  },
  {
    slug: "nested-comments",
    title: "Nested Comments System (Tree Structure)",
    difficulty: "hard",
    tags: ["comments","tree","recursive"],
    prompt: `Build a recursive comment thread module.

* **Comment Item** (\`data-testid="comment-[id]"\`).
* **Reply Button** (\`data-testid="reply-btn-[id]"\`): Opens inline reply text input.
* **Nested List**: Indents child replies directly under parent comment.`,
    testids: ["comment-","reply-btn-"],
    markers: ["reply-btn-","replies","paddingLeft"],
    reactSolution: `import { useState } from "react";

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

export function App() {
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
`,
  },
  {
    slug: "kanban-board",
    title: "Interactive Kanban Board",
    difficulty: "medium",
    tags: ["kanban","board","columns"],
    prompt: `Build a mini Kanban board with columns: "To Do", "In Progress", "Done".

* **Task Card** (\`data-testid="task-card-[id]"\`).
* **Move Controls**: Buttons to shift task card left or right between columns.`,
    testids: ["task-card-"],
    markers: ["To Do","In Progress","Done","Move Left","Move Right"],
    reactSolution: `import { useState } from "react";

const COLS = ["To Do", "In Progress", "Done"];

export function App() {
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
`,
  },
  {
    slug: "faq-accordion",
    title: "Accordion / FAQ Collapsible List",
    difficulty: "easy",
    tags: ["accordion","faq","collapse"],
    prompt: `Build an FAQ accordion list.

* **Headers** (\`data-testid="accordion-header-[id]"\`).
* **Panels** (\`data-testid="accordion-panel-[id]"\`).
* **Rule**: Only one accordion panel can be expanded at a time (expanding B collapses A).`,
    testids: ["accordion-header-","accordion-panel-"],
    markers: ["accordion-header-","accordion-panel-"],
    reactSolution: `import { useState } from "react";

const ITEMS = [
  { id: "1", q: "What is this?", a: "An FAQ accordion." },
  { id: "2", q: "How does it work?", a: "Only one panel opens at a time." },
  { id: "3", q: "Can I close it?", a: "Click the open header again to close." },
];

export function App() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {ITEMS.map((item) => (
        <div key={item.id}>
          <button
            data-testid={"accordion-header-" + item.id}
            onClick={() => setOpen((o) => (o === item.id ? null : item.id))}
          >
            {item.q}
          </button>
          {open === item.id && (
            <div data-testid={"accordion-panel-" + item.id}>{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
`,
  },
  {
    slug: "toast-system",
    title: "Toast Notification System",
    difficulty: "medium",
    tags: ["toast","notifications","feedback"],
    prompt: `Build a custom global toast dispatcher.

* **Trigger Buttons**: Show Success Toast (\`data-testid="btn-toast-success"\`), Show Error Toast (\`data-testid="btn-toast-error"\`).
* **Toast Stack** (\`data-testid="toast-container"\`): Displays stacked auto-dismissing toast alerts.`,
    testids: ["btn-toast-success","btn-toast-error","toast-container"],
    markers: ["Success","Error","setTimeout"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [toasts, setToasts] = useState([]);

  const push = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500);
  };

  return (
    <div>
      <button data-testid="btn-toast-success" onClick={() => push("success", "Success")}>Show Success Toast</button>
      <button data-testid="btn-toast-error" onClick={() => push("error", "Error")}>Show Error Toast</button>
      <div data-testid="toast-container">
        {toasts.map((t) => (
          <div key={t.id} style={{ color: t.type === "error" ? "crimson" : "green" }}>{t.message}</div>
        ))}
      </div>
    </div>
  );
}
`,
  },
  {
    slug: "markdown-previewer",
    title: "Markdown Live Editor & Previewer",
    difficulty: "medium",
    tags: ["markdown","preview","editor"],
    prompt: `Build a split-screen markdown editor.

* **Textarea** (\`data-testid="markdown-input"\`).
* **Preview Area** (\`data-testid="markdown-preview"\`): Renders converted HTML headings, bold text, and lists as user types.`,
    testids: ["markdown-input","markdown-preview"],
    markers: ["# ","**","- ","dangerouslySetInnerHTML"],
    reactSolution: `import { useMemo, useState } from "react";

function toHtml(md) {
  const lines = md.split("\\n");
  const out = [];
  let inList = false;
  for (const line of lines) {
    let l = line;
    if (/^###\\s/.test(l)) { if (inList) { out.push("</ul>"); inList = false; } out.push("<h3>" + l.slice(4) + "</h3>"); continue; }
    if (/^##\\s/.test(l)) { if (inList) { out.push("</ul>"); inList = false; } out.push("<h2>" + l.slice(3) + "</h2>"); continue; }
    if (/^#\\s/.test(l)) { if (inList) { out.push("</ul>"); inList = false; } out.push("<h1>" + l.slice(2) + "</h1>"); continue; }
    if (/^-\\s/.test(l)) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push("<li>" + l.slice(2).replace(/\\*\\*(.+?)\\*\\*/g, "<strong>$1</strong>") + "</li>");
      continue;
    }
    if (inList) { out.push("</ul>"); inList = false; }
    if (l.trim()) out.push("<p>" + l.replace(/\\*\\*(.+?)\\*\\*/g, "<strong>$1</strong>") + "</p>");
  }
  if (inList) out.push("</ul>");
  return out.join("");
}

export function App() {
  const [md, setMd] = useState("# Hello\\n\\n**Bold** text\\n\\n- Item one\\n- Item two");
  const html = useMemo(() => toHtml(md), [md]);
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <textarea data-testid="markdown-input" value={md} onChange={(e) => setMd(e.target.value)} rows={12} style={{ flex: 1 }} />
      <div data-testid="markdown-preview" style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
`,
  },
  {
    slug: "tag-chip-input",
    title: "Tag Input / Chip Creator Field",
    difficulty: "easy",
    tags: ["chips","tags","input"],
    prompt: `Build a chip creator input field.

* **Input** (\`data-testid="chip-input"\`).
* **Behavior**: Pressing \`Enter\` or \`,\` creates a tag chip (\`data-testid="chip-[text]"\`).
* **Delete Action**: Clicking 'X' on a chip removes it.`,
    testids: ["chip-input","chip-"],
    markers: ["Enter",",","X"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [value, setValue] = useState("");
  const [chips, setChips] = useState([]);

  const add = (raw) => {
    const t = raw.trim().replace(/,$/, "");
    if (!t || chips.includes(t)) return;
    setChips((c) => [...c, t]);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(value);
    }
  };

  return (
    <div>
      <div>
        {chips.map((c) => (
          <span key={c} data-testid={"chip-" + c} style={{ marginRight: 6, border: "1px solid #999", padding: "2px 6px" }}>
            {c}
            <button onClick={() => setChips((list) => list.filter((x) => x !== c))}>X</button>
          </span>
        ))}
      </div>
      <input data-testid="chip-input" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKeyDown} />
    </div>
  );
}
`,
  },
  {
    slug: "otp-inputs",
    title: "OTP / Pin Verification Input",
    difficulty: "medium",
    tags: ["otp","pin","focus"],
    prompt: `Build a 6-digit OTP code verification input.

* **Inputs**: Six single-character boxes (\`data-testid="otp-input-[0-5]"\`).
* **Behavior**: Typing a digit automatically shifts focus to the next input field. Pressing \`Backspace\` on an empty input shifts focus back.`,
    testids: ["otp-input-"],
    markers: ["Backspace","focus"],
    reactSolution: `import { useRef, useState } from "react";

export function App() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef([]);

  const setAt = (i, val) => {
    const d = val.replace(/\\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <div>
      {digits.map((d, i) => (
        <input
          key={i}
          data-testid={"otp-input-" + i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          maxLength={1}
          onChange={(e) => setAt(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          style={{ width: 32, textAlign: "center", marginRight: 4 }}
        />
      ))}
    </div>
  );
}
`,
  },
  {
    slug: "rich-text-toolbar",
    title: "Rich Text Formatting Toolbar",
    difficulty: "medium",
    tags: ["editor","toolbar","contentEditable"],
    prompt: `Build a mini text formatting toolbar.

* **Text Area / ContentEditable** (\`data-testid="editor-area"\`).
* **Buttons**: Bold (\`data-testid="btn-bold"\`), Italic (\`data-testid="btn-italic"\`), Underline (\`data-testid="btn-underline"\`).`,
    testids: ["editor-area","btn-bold","btn-italic","btn-underline"],
    markers: ["execCommand","bold","italic","underline"],
    reactSolution: `export function App() {
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
`,
  },
  {
    slug: "theme-switch-dark",
    title: "Dark Mode / Light Mode Theme Toggle",
    difficulty: "easy",
    tags: ["theme","dark-mode","localStorage"],
    prompt: `Build an application-wide dark mode switcher.

* **Toggle Switch** (\`data-testid="theme-switch"\`).
* **Execution**: Toggles CSS class \`.dark\` on \`document.body\` and stores preference in \`localStorage\`.`,
    testids: ["theme-switch"],
    markers: ["dark","localStorage","document.body"],
    reactSolution: `import { useEffect, useState } from "react";

export function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(localStorage.getItem("theme") === "dark");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div>
      <label>
        <input
          data-testid="theme-switch"
          type="checkbox"
          checked={dark}
          onChange={(e) => setDark(e.target.checked)}
        />
        Dark mode
      </label>
    </div>
  );
}
`,
  },
  {
    slug: "breadcrumb-nav",
    title: "Breadcrumb Navigation",
    difficulty: "easy",
    tags: ["breadcrumb","nav","routing"],
    prompt: `Build a dynamic breadcrumb component based on current URL path segments.

* **Breadcrumb Nav** (\`data-testid="breadcrumb-nav"\`).
* **Items**: Array of links representing sub-paths (e.g., \`Home > Products > Electronics\`).`,
    testids: ["breadcrumb-nav"],
    markers: ["Home","Products","Electronics"],
    reactSolution: `import { useState } from "react";

const PATHS = {
  "/": ["Home"],
  "/products": ["Home", "Products"],
  "/products/electronics": ["Home", "Products", "Electronics"],
};

export function App() {
  const [path, setPath] = useState("/products/electronics");
  const crumbs = PATHS[path] || ["Home"];

  return (
    <div>
      <nav data-testid="breadcrumb-nav">
        {crumbs.map((c, i) => (
          <span key={c}>
            {i > 0 && " > "}
            <a href="#" onClick={(e) => { e.preventDefault(); setPath(i === 0 ? "/" : i === 1 ? "/products" : "/products/electronics"); }}>{c}</a>
          </span>
        ))}
      </nav>
      <div>
        <button onClick={() => setPath("/")}>Home</button>
        <button onClick={() => setPath("/products")}>Products</button>
        <button onClick={() => setPath("/products/electronics")}>Electronics</button>
      </div>
    </div>
  );
}
`,
  },
  {
    slug: "date-range-picker",
    title: "Date Picker & Range Selector",
    difficulty: "easy",
    tags: ["date","validation","range"],
    prompt: `Build a date range selection input.

* **Inputs**: Start Date (\`data-testid="start-date"\`), End Date (\`data-testid="end-date"\`).
* **Validation Message** (\`data-testid="date-error"\`): Displays error if End Date is chronologically prior to Start Date.`,
    testids: ["start-date","end-date","date-error"],
    markers: ["date-error","prior","End Date"],
    reactSolution: `import { useMemo, useState } from "react";

export function App() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const error = useMemo(() => start && end && end < start, [start, end]);

  return (
    <div>
      <input data-testid="start-date" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
      <input data-testid="end-date" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
      {error && <p data-testid="date-error">End Date cannot be prior to Start Date</p>}
    </div>
  );
}
`,
  },
  {
    slug: "polling-status",
    title: "Polling Dashboard Widget",
    difficulty: "medium",
    tags: ["polling","status","interval"],
    prompt: `Build a real-time server status polling component.

* **Status Indicator** (\`data-testid="server-status"\`).
* **Behavior**: Calls mock healthcheck endpoint every 5 seconds. Displays "Healthy" or "Unreachable".
* **Pause Toggle** (\`data-testid="pause-polling-btn"\`): Temporarily halts interval.`,
    testids: ["server-status","pause-polling-btn"],
    markers: ["Healthy","Unreachable","5000","pause"],
    reactSolution: `import { useEffect, useState } from "react";

async function healthcheck() {
  return Math.random() > 0.2 ? "Healthy" : "Unreachable";
}

export function App() {
  const [status, setStatus] = useState("Healthy");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    let alive = true;
    const tick = async () => {
      const s = await healthcheck();
      if (alive) setStatus(s);
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => { alive = false; clearInterval(id); };
  }, [paused]);

  return (
    <div>
      <div data-testid="server-status">{status}</div>
      <button data-testid="pause-polling-btn" onClick={() => setPaused((p) => !p)}>
        {paused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}
`,
  },
  {
    slug: "copy-clipboard",
    title: "Copy to Clipboard Button",
    difficulty: "easy",
    tags: ["clipboard","copy","feedback"],
    prompt: `Build a code snippet viewer with copy button.

* **Code Container** (\`data-testid="code-block"\`).
* **Copy Button** (\`data-testid="copy-btn"\`).
* **Feedback**: Text changes from "Copy" to "Copied!" for 2 seconds after click.`,
    testids: ["code-block","copy-btn"],
    markers: ["Copied!","Copy","clipboard"],
    reactSolution: `import { useState } from "react";

const CODE = "console.log('hello');";

export function App() {
  const [label, setLabel] = useState("Copy");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
    } catch {
      /* ignore in non-secure contexts */
    }
    setLabel("Copied!");
    setTimeout(() => setLabel("Copy"), 2000);
  };

  return (
    <div>
      <pre data-testid="code-block">{CODE}</pre>
      <button data-testid="copy-btn" onClick={copy}>{label}</button>
    </div>
  );
}
`,
  },
  {
    slug: "custom-select-search",
    title: "Custom Dropdown Select with Search Filter",
    difficulty: "medium",
    tags: ["select","dropdown","search"],
    prompt: `Build a searchable select dropdown without native \`<select>\`.

* **Trigger** (\`data-testid="custom-select-trigger"\`).
* **Filter Input** (\`data-testid="custom-select-search"\`).
* **Options List** (\`data-testid="custom-select-options"\`): Displays options matching filter text.`,
    testids: ["custom-select-trigger","custom-select-search","custom-select-options"],
    markers: ["custom-select-options","filter"],
    reactSolution: `import { useMemo, useState } from "react";

const OPTIONS = ["React", "Vue", "Angular", "Svelte", "Solid"];

export function App() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [value, setValue] = useState("");
  const filtered = useMemo(
    () => OPTIONS.filter((o) => o.toLowerCase().includes(filter.toLowerCase())),
    [filter]
  );

  return (
    <div>
      <button data-testid="custom-select-trigger" onClick={() => setOpen((o) => !o)}>
        {value || "Select..."}
      </button>
      {open && (
        <div>
          <input data-testid="custom-select-search" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <ul data-testid="custom-select-options">
            {filtered.map((o) => (
              <li key={o} onClick={() => { setValue(o); setOpen(false); setFilter(""); }}>{o}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
`,
  },
  {
    slug: "color-picker",
    title: "Color Picker Widget",
    difficulty: "easy",
    tags: ["color","picker","hex"],
    prompt: `Build a color selection tool.

* **Color Swatches** (\`data-testid="swatch-[color]"\`).
* **Hex Input** (\`data-testid="hex-input"\`).
* **Preview Box** (\`data-testid="color-preview"\`): Background color matches chosen selection.`,
    testids: ["swatch-","hex-input","color-preview"],
    markers: ["#ff0000","hex-input","color-preview"],
    reactSolution: `import { useState } from "react";

const SWATCHES = ["#ff0000", "#00aa00", "#0066ff", "#ffaa00", "#8800ff"];

export function App() {
  const [color, setColor] = useState("#ff0000");

  return (
    <div>
      {SWATCHES.map((c) => (
        <button
          key={c}
          data-testid={"swatch-" + c}
          onClick={() => setColor(c)}
          style={{ background: c, width: 28, height: 28, marginRight: 4, border: color === c ? "2px solid #000" : "1px solid #ccc" }}
        />
      ))}
      <input data-testid="hex-input" value={color} onChange={(e) => setColor(e.target.value)} />
      <div data-testid="color-preview" style={{ width: 80, height: 80, background: color, marginTop: 8 }} />
    </div>
  );
}
`,
  },
  {
    slug: "audio-player-ui",
    title: "Audio Player UI",
    difficulty: "medium",
    tags: ["audio","player","controls"],
    prompt: `Build a mini custom audio player interface.

* **Controls**: Play/Pause (\`data-testid="play-pause-btn"\`).
* **Progress Bar** (\`data-testid="audio-progress"\`): Reflects percentage elapsed.
* **Time Display** (\`data-testid="time-display"\`): Shows \`mm:ss\`.`,
    testids: ["play-pause-btn","audio-progress","time-display"],
    markers: ["Play","Pause","progress","padStart"],
    reactSolution: `import { useEffect, useRef, useState } from "react";

const SILENT =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";

function fmt(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const r = String(s % 60).padStart(2, "0");
  return m + ":" + r;
}

export function App() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      setTime(a.currentTime);
      setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <div>
      <audio ref={audioRef} src={SILENT} preload="auto" />
      <button data-testid="play-pause-btn" onClick={toggle}>{playing ? "Pause" : "Play"}</button>
      <progress data-testid="audio-progress" max={100} value={progress} />
      <span data-testid="time-display">{fmt(time)}</span>
      <span> / {fmt(duration)}</span>
    </div>
  );
}
`,
  },
  {
    slug: "password-strength",
    title: "Password Strength Meter",
    difficulty: "easy",
    tags: ["password","validation","meter"],
    prompt: `Build an interactive password evaluation field.

* **Input** (\`data-testid="password-input"\`).
* **Meter Display** (\`data-testid="strength-meter"\`): Updates visual score (Weak, Medium, Strong) based on length, numbers, and special characters.`,
    testids: ["password-input","strength-meter"],
    markers: ["Weak","Medium","Strong"],
    reactSolution: `import { useMemo, useState } from "react";

function score(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/\\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return "Weak";
  if (s <= 3) return "Medium";
  return "Strong";
}

export function App() {
  const [pw, setPw] = useState("");
  const strength = useMemo(() => (pw ? score(pw) : ""), [pw]);

  return (
    <div>
      <input data-testid="password-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
      <div data-testid="strength-meter">{strength || "—"}</div>
    </div>
  );
}
`,
  },
  {
    slug: "select-all-checkboxes",
    title: "Multi-Select Checkbox Group with Select All",
    difficulty: "easy",
    tags: ["checkbox","select-all","forms"],
    prompt: `Build a checkbox group list.

* **Select All Checkbox** (\`data-testid="select-all-checkbox"\`).
* **Item Checkboxes** (\`data-testid="item-checkbox-[id]"\`).
* **Behavior**: Toggling "Select All" checks/unchecks all sub-items; checking all sub-items automatically checks "Select All".`,
    testids: ["select-all-checkbox","item-checkbox-"],
    markers: ["Select All","item-checkbox-"],
    reactSolution: `import { useMemo, useState } from "react";

const IDS = ["a", "b", "c", "d"];

export function App() {
  const [checked, setChecked] = useState(() => Object.fromEntries(IDS.map((id) => [id, false])));
  const all = useMemo(() => IDS.every((id) => checked[id]), [checked]);

  const toggleAll = (val) => setChecked(Object.fromEntries(IDS.map((id) => [id, val])));

  return (
    <div>
      <label>
        <input
          data-testid="select-all-checkbox"
          type="checkbox"
          checked={all}
          onChange={(e) => toggleAll(e.target.checked)}
        />
        Select All
      </label>
      {IDS.map((id) => (
        <label key={id}>
          <input
            data-testid={"item-checkbox-" + id}
            type="checkbox"
            checked={checked[id]}
            onChange={(e) => setChecked((c) => ({ ...c, [id]: e.target.checked }))}
          />
          Item {id}
        </label>
      ))}
    </div>
  );
}
`,
  },
  {
    slug: "read-more-toggle",
    title: "Read More / Read Less Text Truncator",
    difficulty: "easy",
    tags: ["truncate","read-more","text"],
    prompt: `Build a text content truncator.

* **Text Block** (\`data-testid="text-block"\`): Truncated to first 100 characters by default.
* **Action Button** (\`data-testid="toggle-read-more"\`): Switches between "Read More" and "Read Less" states.`,
    testids: ["text-block","toggle-read-more"],
    markers: ["Read More","Read Less","100"],
    reactSolution: `import { useState } from "react";

const FULL =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

export function App() {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? FULL : FULL.slice(0, 100) + (FULL.length > 100 ? "…" : "");

  return (
    <div>
      <p data-testid="text-block">{shown}</p>
      <button data-testid="toggle-read-more" onClick={() => setExpanded((e) => !e)}>
        {expanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
}
`,
  },
  {
    slug: "resizable-panels",
    title: "Split View / Resizable Panels",
    difficulty: "medium",
    tags: ["split","resize","panels"],
    prompt: `Build a 2-column split pane interface.

* **Left Panel** (\`data-testid="left-panel"\`), **Right Panel** (\`data-testid="right-panel"\`).
* **Divider Handle** (\`data-testid="resize-handle"\`): Dragging left/right adjusts width percentages of adjacent panels.`,
    testids: ["left-panel","right-panel","resize-handle"],
    markers: ["resize-handle","onMouseDown","width"],
    reactSolution: `import { useRef, useState } from "react";

export function App() {
  const [leftPct, setLeftPct] = useState(40);
  const box = useRef(null);

  const onMouseDown = (e) => {
    e.preventDefault();
    const onMove = (ev) => {
      const rect = box.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftPct(Math.min(80, Math.max(20, pct)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div ref={box} style={{ display: "flex", height: 200, border: "1px solid #ccc" }}>
      <div data-testid="left-panel" style={{ width: leftPct + "%", overflow: "auto", padding: 8 }}>Left</div>
      <div
        data-testid="resize-handle"
        onMouseDown={onMouseDown}
        style={{ width: 6, cursor: "col-resize", background: "#bbb" }}
      />
      <div data-testid="right-panel" style={{ width: 100 - leftPct + "%", overflow: "auto", padding: 8 }}>Right</div>
    </div>
  );
}
`,
  },
  {
    slug: "inactivity-warning",
    title: "User Inactivity Auto-Logout Warning",
    difficulty: "medium",
    tags: ["idle","session","modal"],
    prompt: `Build an idle session detector.

* **Warning Modal** (\`data-testid="inactivity-modal"\`): Displays after 60 seconds without mouse move or keypress.
* **Stay Logged In Button** (\`data-testid="stay-active-btn"\`): Resets idle timer.`,
    testids: ["inactivity-modal","stay-active-btn"],
    markers: ["60000","mousemove","keypress","Stay Logged In"],
    reactSolution: `import { useEffect, useRef, useState } from "react";

const IDLE_MS = 60000;

export function App() {
  const [warn, setWarn] = useState(false);
  const timer = useRef(null);

  const reset = () => {
    setWarn(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setWarn(true), IDLE_MS);
  };

  useEffect(() => {
    reset();
    const events = ["mousemove", "keypress", "keydown", "click"];
    events.forEach((ev) => window.addEventListener(ev, reset));
    return () => {
      clearTimeout(timer.current);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, []);

  return (
    <div>
      <p>Active session</p>
      {warn && (
        <div data-testid="inactivity-modal" role="dialog">
          <p>You have been inactive.</p>
          <button data-testid="stay-active-btn" onClick={reset}>Stay Logged In</button>
        </div>
      )}
    </div>
  );
}
`,
  },
  {
    slug: "countdown-timer",
    title: "Countdown Timer Widget",
    difficulty: "medium",
    tags: ["countdown","timer","event"],
    prompt: `Build a event launch countdown widget.

* **Display** (\`data-testid="countdown-display"\`): Shows Days, Hours, Minutes, Seconds remaining.
* **Completion Banner** (\`data-testid="event-launched-msg"\`): Displays when target timestamp is reached.`,
    testids: ["countdown-display","event-launched-msg"],
    markers: ["Days","Hours","Minutes","Seconds","launched"],
    reactSolution: `import { useEffect, useState } from "react";

const TARGET = Date.now() + 1000 * 60 * 60 * 24 + 5000;

function parts(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds, done: ms <= 0 };
}

export function App() {
  const [left, setLeft] = useState(() => parts(TARGET - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setLeft(parts(TARGET - Date.now())), 250);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {!left.done ? (
        <div data-testid="countdown-display">
          {left.days} Days {left.hours} Hours {left.minutes} Minutes {left.seconds} Seconds
        </div>
      ) : (
        <div data-testid="event-launched-msg">Event launched!</div>
      )}
    </div>
  );
}
`,
  },
  {
    slug: "credit-card-visual",
    title: "Virtual Credit Card Visualizer",
    difficulty: "medium",
    tags: ["credit-card","form","visual"],
    prompt: `Build a live credit card form visualization.

* **Inputs**: Card Number, Expiry, CVV.
* **Visual Card View** (\`data-testid="visual-card"\`): Real-time updates front/back of card visual as user inputs details.`,
    testids: ["visual-card"],
    markers: ["Card Number","Expiry","CVV","visual-card"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [flip, setFlip] = useState(false);

  return (
    <div>
      <label>Card Number <input value={number} onChange={(e) => setNumber(e.target.value.replace(/\\D/g, "").slice(0, 16))} onFocus={() => setFlip(false)} /></label>
      <label>Expiry <input value={expiry} onChange={(e) => setExpiry(e.target.value.slice(0, 5))} onFocus={() => setFlip(false)} placeholder="MM/YY" /></label>
      <label>CVV <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\\D/g, "").slice(0, 3))} onFocus={() => setFlip(true)} /></label>
      <div data-testid="visual-card" style={{ marginTop: 16, padding: 16, background: "#1a3a5c", color: "#fff", borderRadius: 12, minHeight: 120 }}>
        {flip ? (
          <div>CVV: {cvv || "***"}</div>
        ) : (
          <div>
            <div>{(number || "•••• •••• •••• ••••").replace(/(\\d{4})(?=\\d)/g, "$1 ").trim()}</div>
            <div>Exp {expiry || "MM/YY"}</div>
          </div>
        )}
      </div>
    </div>
  );
}
`,
  },
  {
    slug: "cart-drawer",
    title: "Shopping Cart Drawer (Slide-Over)",
    difficulty: "easy",
    tags: ["drawer","cart","slide-over"],
    prompt: `Build a slide-out shopping cart drawer.

* **Open Cart Button** (\`data-testid="open-cart-btn"\`).
* **Overlay/Drawer Panel** (\`data-testid="cart-drawer"\`): Slides in from right margin.
* **Close Button** (\`data-testid="close-cart-btn"\`).`,
    testids: ["open-cart-btn","cart-drawer","close-cart-btn"],
    markers: ["open-cart-btn","close-cart-btn","cart-drawer"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button data-testid="open-cart-btn" onClick={() => setOpen(true)}>Open Cart</button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)" }} />
          <aside
            data-testid="cart-drawer"
            style={{ position: "fixed", top: 0, right: 0, width: 280, height: "100%", background: "#fff", padding: 16, boxShadow: "-2px 0 8px rgba(0,0,0,.2)" }}
          >
            <h2>Cart</h2>
            <p>Your cart is empty.</p>
            <button data-testid="close-cart-btn" onClick={() => setOpen(false)}>Close</button>
          </aside>
        </>
      )}
    </div>
  );
}
`,
  },
  {
    slug: "cookie-consent",
    title: "Cookie Consent Banner",
    difficulty: "easy",
    tags: ["cookies","consent","gdpr","localStorage"],
    prompt: `Build a GDPR cookie consent banner.

* **Banner Container** (\`data-testid="cookie-banner"\`).
* **Accept Button** (\`data-testid="accept-cookies-btn"\`).
* **Behavior**: Hides banner and stores preference \`cookies_accepted=true\` in \`localStorage\`.`,
    testids: ["cookie-banner","accept-cookies-btn"],
    markers: ["cookies_accepted","localStorage"],
    reactSolution: `import { useEffect, useState } from "react";

export function App() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(localStorage.getItem("cookies_accepted") !== "true");
  }, []);

  const accept = () => {
    localStorage.setItem("cookies_accepted", "true");
    setVisible(false);
  };

  if (!visible) return <div>Thanks for accepting cookies.</div>;

  return (
    <div data-testid="cookie-banner" style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: 16, background: "#222", color: "#fff" }}>
      <p>We use cookies to improve your experience.</p>
      <button data-testid="accept-cookies-btn" onClick={accept}>Accept</button>
    </div>
  );
}
`,
  },
  {
    slug: "fab-menu",
    title: "Animated Floating Action Button (FAB) Menu",
    difficulty: "easy",
    tags: ["fab","menu","animation"],
    prompt: `Build an expandable floating action menu.

* **Main FAB** (\`data-testid="fab-main"\`).
* **Child Actions** (\`data-testid="fab-child-[1-3]"\`): Expand outwards radially/vertically on main FAB click.`,
    testids: ["fab-main","fab-child-1","fab-child-2","fab-child-3"],
    markers: ["fab-child-1","fab-child-2","fab-child-3"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24 }}>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
          <button data-testid="fab-child-1">Action 1</button>
          <button data-testid="fab-child-2">Action 2</button>
          <button data-testid="fab-child-3">Action 3</button>
        </div>
      )}
      <button data-testid="fab-main" onClick={() => setOpen((o) => !o)} style={{ borderRadius: "50%", width: 56, height: 56 }}>
        {open ? "×" : "+"}
      </button>
    </div>
  );
}
`,
  },
  {
    slug: "mentions-input",
    title: "Mentions Input Field (@username)",
    difficulty: "medium",
    tags: ["mentions","autocomplete","textarea"],
    prompt: `Build a comment box supporting user \`@mentions\`.

* **Textarea** (\`data-testid="mention-input"\`).
* **Mention Dropdown** (\`data-testid="mention-dropdown"\`): Appears when user types \`@\` character.`,
    testids: ["mention-input","mention-dropdown"],
    markers: ["@","mention-dropdown","USERS"],
    reactSolution: `import { useMemo, useState } from "react";

const USERS = ["alice", "bob", "carol", "dave"];

export function App() {
  const [text, setText] = useState("");
  const mention = useMemo(() => {
    const m = text.match(/(?:^|\\s)@([\\w]*)$/);
    return m ? m[1] : null;
  }, [text]);

  const suggestions = mention !== null
    ? USERS.filter((u) => u.startsWith(mention.toLowerCase()))
    : [];

  const pick = (user) => {
    setText((t) => t.replace(/(?:^|\\s)@([\\w]*)$/, (full) => full.replace(/@[\\w]*$/, "@" + user + " ")));
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
`,
  },
  {
    slug: "dynamic-form-builder",
    title: "Dynamic Form Field Builder",
    difficulty: "medium",
    tags: ["form-builder","dynamic","fields"],
    prompt: `Build a dynamic form constructor where users add custom fields.

* **Add Field Button** (\`data-testid="add-field-btn"\`).
* **Field Rows** (\`data-testid="custom-field-[index]"\`): Includes field label input, field type select (Text, Number), and Remove button.`,
    testids: ["add-field-btn","custom-field-"],
    markers: ["Text","Number","Remove","custom-field-"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [fields, setFields] = useState([{ label: "", type: "Text" }]);

  const update = (i, patch) => setFields((f) => f.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  return (
    <div>
      <button data-testid="add-field-btn" onClick={() => setFields((f) => [...f, { label: "", type: "Text" }])}>
        Add Field
      </button>
      {fields.map((field, i) => (
        <div key={i} data-testid={"custom-field-" + i} style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input placeholder="Label" value={field.label} onChange={(e) => update(i, { label: e.target.value })} />
          <select value={field.type} onChange={(e) => update(i, { type: e.target.value })}>
            <option>Text</option>
            <option>Number</option>
          </select>
          <button onClick={() => setFields((f) => f.filter((_, idx) => idx !== i))}>Remove</button>
        </div>
      ))}
    </div>
  );
}
`,
  },
  {
    slug: "image-zoomer",
    title: "Interactive Product Image Zoomer",
    difficulty: "medium",
    tags: ["zoom","image","ecommerce"],
    prompt: `Build an e-commerce image magnification component.

* **Base Image** (\`data-testid="product-image"\`).
* **Zoom Lens/Preview Pane** (\`data-testid="zoom-preview"\`): Magnifies section of image under active cursor position.`,
    testids: ["product-image","zoom-preview"],
    markers: ["backgroundPosition","backgroundSize","onMouseMove"],
    reactSolution: `import { useRef, useState } from "react";

const SRC = "https://via.placeholder.com/300";

export function App() {
  const imgRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50, show: false });

  const onMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y, show: true });
  };

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <img
        ref={imgRef}
        data-testid="product-image"
        src={SRC}
        alt="Product"
        onMouseMove={onMove}
        onMouseLeave={() => setPos((p) => ({ ...p, show: false }))}
        width={300}
        height={300}
      />
      {pos.show && (
        <div
          data-testid="zoom-preview"
          style={{
            width: 200,
            height: 200,
            backgroundImage: "url(" + SRC + ")",
            backgroundSize: "200%",
            backgroundPosition: pos.x + "% " + pos.y + "%",
            border: "1px solid #ccc",
          }}
        />
      )}
    </div>
  );
}
`,
  },
  {
    slug: "file-tree-view",
    title: "Tree View / Hierarchical Directory File Explorer",
    difficulty: "medium",
    tags: ["tree","files","folders"],
    prompt: `Build a directory file tree viewer.

* **Folder Item** (\`data-testid="folder-[id]"\`): Click to expand/collapse sub-files.
* **File Item** (\`data-testid="file-[id]"\`): Displays file icon and title.`,
    testids: ["folder-","file-"],
    markers: ["folder-","file-","onClick"],
    reactSolution: `import { useState } from "react";

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
`,
  },
  {
    slug: "network-status-banner",
    title: "Network Status Alert Banner",
    difficulty: "easy",
    tags: ["network","offline","banner"],
    prompt: `Build an internet connectivity monitoring banner.

* **Status Banner** (\`data-testid="network-status-banner"\`).
* **Behavior**: Listens to \`window.addEventListener('offline')\` and \`window.addEventListener('online')\` to show "You are offline" or "Connection restored".`,
    testids: ["network-status-banner"],
    markers: ["You are offline","Connection restored","offline","online"],
    reactSolution: `import { useEffect, useState } from "react";

export function App() {
  const [msg, setMsg] = useState(navigator.onLine ? "Connection restored" : "You are offline");

  useEffect(() => {
    const onOffline = () => setMsg("You are offline");
    const onOnline = () => setMsg("Connection restored");
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return (
    <div data-testid="network-status-banner" style={{ padding: 12, background: msg.includes("offline") ? "#fee" : "#efe" }}>
      {msg}
    </div>
  );
}
`,
  },
  {
    slug: "print-receipt",
    title: "Print-Friendly Receipt View",
    difficulty: "easy",
    tags: ["print","invoice","receipt"],
    prompt: `Build an invoice preview view with print trigger.

* **Invoice Container** (\`data-testid="invoice-view"\`).
* **Print Button** (\`data-testid="print-btn"\`): Triggers \`window.print()\` and applies \`@media print\` CSS overrides.`,
    testids: ["invoice-view","print-btn"],
    markers: ["window.print","@media print"],
    reactSolution: `export function App() {
  return (
    <div>
      <style>{\`
        @media print {
          .no-print { display: none !important; }
          [data-testid="invoice-view"] { border: none; }
        }
      \`}</style>
      <div data-testid="invoice-view" style={{ border: "1px solid #ccc", padding: 16 }}>
        <h1>Invoice #1001</h1>
        <p>Item A — $20</p>
        <p>Item B — $15</p>
        <p><strong>Total: $35</strong></p>
      </div>
      <button className="no-print" data-testid="print-btn" onClick={() => window.print()}>Print</button>
    </div>
  );
}
`,
  },
  {
    slug: "stepper-indicator",
    title: "Stepper Indicator Component",
    difficulty: "easy",
    tags: ["stepper","progress","wizard"],
    prompt: `Build a step progress indicator widget.

* **Stepper Container** (\`data-testid="stepper"\`).
* **Step Nodes** (\`data-testid="step-node-[1-4]"\`): Displays states: \`completed\`, \`active\`, or \`pending\`.`,
    testids: ["stepper","step-node-"],
    markers: ["completed","active","pending"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [step, setStep] = useState(2);

  const stateOf = (n) => (n < step ? "completed" : n === step ? "active" : "pending");

  return (
    <div>
      <div data-testid="stepper" style={{ display: "flex", gap: 12 }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} data-testid={"step-node-" + n} data-state={stateOf(n)} style={{ opacity: stateOf(n) === "pending" ? 0.5 : 1, fontWeight: stateOf(n) === "active" ? "bold" : "normal" }}>
            Step {n} ({stateOf(n)})
          </div>
        ))}
      </div>
      <button disabled={step <= 1} onClick={() => setStep((s) => s - 1)}>Back</button>
      <button disabled={step >= 4} onClick={() => setStep((s) => s + 1)}>Next</button>
    </div>
  );
}
`,
  },
  {
    slug: "pricing-calculator",
    title: "Interactive Pricing Calculator / Slider",
    difficulty: "medium",
    tags: ["pricing","slider","calculator"],
    prompt: `Build a SaaS tier pricing estimator.

* **User Count Slider** (\`data-testid="user-slider"\`): Range 1 to 100.
* **Billing Cycle Toggle** (\`data-testid="billing-toggle"\`): Monthly / Yearly (20% discount).
* **Price Calculated Display** (\`data-testid="calculated-price"\`).`,
    testids: ["user-slider","billing-toggle","calculated-price"],
    markers: ["Monthly","Yearly","20%","calculated-price"],
    reactSolution: `import { useMemo, useState } from "react";

const PER_USER = 10;

export function App() {
  const [users, setUsers] = useState(10);
  const [yearly, setYearly] = useState(false);

  const price = useMemo(() => {
    const monthly = users * PER_USER;
    return yearly ? Math.round(monthly * 12 * 0.8) : monthly;
  }, [users, yearly]);

  return (
    <div>
      <label>
        Users
        <input
          data-testid="user-slider"
          type="range"
          min={1}
          max={100}
          value={users}
          onChange={(e) => setUsers(Number(e.target.value))}
        />
        {users}
      </label>
      <label>
        <input
          data-testid="billing-toggle"
          type="checkbox"
          checked={yearly}
          onChange={(e) => setYearly(e.target.checked)}
        />
        {yearly ? "Yearly" : "Monthly"} (20% discount yearly)
      </label>
      <div data-testid="calculated-price">\${price}</div>
    </div>
  );
}
`,
  },
];
