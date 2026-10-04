/**
 * React core concept cases (prompts 1–25) from references/react-tasks.md.
 * Consumed by suite generators; Next wraps App → Page with "use client".
 */
export const coreCases = [
  {
    slug: "counter-state",
    title: "State Management & Event Handling",
    difficulty: "easy",
    tags: ["react", "useState", "events"],
    prompt: `Build a simple counter component.

* **Counter Container** (\`data-testid="counter-container"\`)
* **Display** (\`data-testid="count-display"\`): Shows current count (starts at 0).
* **Buttons**:
* Increments count (\`data-testid="increment-btn"\`).
* Decrements count (\`data-testid="decrement-btn"\`).
* Resets count to 0 (\`data-testid="reset-btn"\`).

* **Rules**: Prevent decrementing below 0.`,
    testids: [
      "counter-container",
      "count-display",
      "increment-btn",
      "decrement-btn",
      "reset-btn",
    ],
    markers: ["useState", "Math.max"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div data-testid="counter-container">
      <span data-testid="count-display">{count}</span>
      <button data-testid="increment-btn" onClick={() => setCount((c) => c + 1)}>
        +
      </button>
      <button
        data-testid="decrement-btn"
        onClick={() => setCount((c) => Math.max(0, c - 1))}
      >
        -
      </button>
      <button data-testid="reset-btn" onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
`,
  },
  {
    slug: "login-form",
    title: "Controlled Inputs & Form State",
    difficulty: "easy",
    tags: ["react", "forms", "controlled-inputs"],
    prompt: `Build a basic login form.

* **Form** (\`data-testid="login-form"\`)
* **Inputs**: Email (\`data-testid="email-input"\`), Password (\`data-testid="password-input"\`).
* **Submit Button** (\`data-testid="submit-btn"\`).
* **Output Message** (\`data-testid="form-status"\`): Shows "Welcome, [email]" on valid submit, or "Please fill all fields" if any input is empty.`,
    testids: [
      "login-form",
      "email-input",
      "password-input",
      "submit-btn",
      "form-status",
    ],
    markers: ["Welcome,", "Please fill all fields"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setStatus("Please fill all fields");
      return;
    }
    setStatus(\`Welcome, \${email}\`);
  }

  return (
    <form data-testid="login-form" onSubmit={handleSubmit}>
      <input
        data-testid="email-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        data-testid="password-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button data-testid="submit-btn" type="submit">
        Submit
      </button>
      <p data-testid="form-status">{status}</p>
    </form>
  );
}
`,
  },
  {
    slug: "status-badge",
    title: "Conditional Rendering",
    difficulty: "easy",
    tags: ["react", "conditional-rendering"],
    prompt: `Build a toggleable user status badge.

* **Container** (\`data-testid="status-container"\`)
* **Toggle Button** (\`data-testid="status-toggle-btn"\`).
* **Status Badge** (\`data-testid="status-badge"\`): Renders text "Online" with green background when true, and "Offline" with gray background when false.`,
    testids: ["status-container", "status-toggle-btn", "status-badge"],
    markers: ["Online", "Offline"],
    reactSolution: `import { useState } from "react";

export function App() {
  const [online, setOnline] = useState(true);

  return (
    <div data-testid="status-container">
      <button
        data-testid="status-toggle-btn"
        onClick={() => setOnline((v) => !v)}
      >
        Toggle
      </button>
      <span
        data-testid="status-badge"
        style={{
          background: online ? "green" : "gray",
          color: "#fff",
          padding: "4px 8px",
        }}
      >
        {online ? "Online" : "Offline"}
      </span>
    </div>
  );
}
`,
  },
  {
    slug: "dynamic-item-list",
    title: "Dynamic List Rendering & Key Props",
    difficulty: "easy",
    tags: ["react", "lists", "keys"],
    prompt: `Build a dynamic item list where users can add items.

* **Input Field** (\`data-testid="item-input"\`)
* **Add Button** (\`data-testid="add-btn"\`)
* **List Container** (\`data-testid="item-list"\`): Renders \`<li>\` elements with \`data-testid="item-row-[index]"\`.
* **Validation**: Do not allow empty string items to be appended.`,
    testids: ["item-input", "add-btn", "item-list", "item-row-"],
    markers: ["item-row-", "key="],
    reactSolution: `import { useState } from "react";

export function App() {
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);

  function addItem() {
    const trimmed = value.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, trimmed]);
    setValue("");
  }

  return (
    <div>
      <input
        data-testid="item-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button data-testid="add-btn" onClick={addItem}>
        Add
      </button>
      <ul data-testid="item-list">
        {items.map((item, index) => (
          <li key={index} data-testid={\`item-row-\${index}\`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
  },
  {
    slug: "user-profile-card",
    title: "Passing Props & Component Composition",
    difficulty: "easy",
    tags: ["react", "props", "composition"],
    prompt: `Build a \`UserProfileCard\` component accepting \`user\` object props (\`name\`, \`role\`, \`avatarUrl\`).

* **Card Container** (\`data-testid="user-card"\`)
* **Avatar Image** (\`data-testid="user-avatar"\`): \`src\` must match \`avatarUrl\`.
* **Name Heading** (\`data-testid="user-name"\`): Matches \`user.name\`.
* **Role Text** (\`data-testid="user-role"\`): Matches \`user.role\`.`,
    testids: ["user-card", "user-avatar", "user-name", "user-role"],
    markers: ["UserProfileCard", "avatarUrl"],
    reactSolution: `function UserProfileCard({ user }) {
  return (
    <div data-testid="user-card">
      <img data-testid="user-avatar" src={user.avatarUrl} alt={user.name} />
      <h2 data-testid="user-name">{user.name}</h2>
      <p data-testid="user-role">{user.role}</p>
    </div>
  );
}

export function App() {
  const user = {
    name: "Ada Lovelace",
    role: "Engineer",
    avatarUrl: "https://example.com/ada.png",
  };

  return <UserProfileCard user={user} />;
}
`,
  },
  {
    slug: "modal-children",
    title: "Children Prop Composition",
    difficulty: "easy",
    tags: ["react", "children", "composition"],
    prompt: `Build a reusable \`Modal\` wrapper component utilizing \`children\`.

* **Modal Wrapper** (\`data-testid="modal-wrapper"\`)
* **Modal Header** (\`data-testid="modal-title"\`): Renders \`title\` prop.
* **Modal Content** (\`data-testid="modal-body"\`): Renders passed \`children\`.
* **Close Button** (\`data-testid="modal-close-btn"\`): Triggers \`onClose\` callback.`,
    testids: [
      "modal-wrapper",
      "modal-title",
      "modal-body",
      "modal-close-btn",
    ],
    markers: ["children", "onClose"],
    reactSolution: `import { useState } from "react";

function Modal({ title, onClose, children }) {
  return (
    <div data-testid="modal-wrapper">
      <h2 data-testid="modal-title">{title}</h2>
      <div data-testid="modal-body">{children}</div>
      <button data-testid="modal-close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export function App() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && (
        <Modal title="Hello" onClose={() => setOpen(false)}>
          <p>Modal body content</p>
        </Modal>
      )}
    </div>
  );
}
`,
  },
  {
    slug: "document-title-sync",
    title: "useEffect & Side Effects (DOM Title Synchronization)",
    difficulty: "easy",
    tags: ["react", "useEffect", "side-effects"],
    prompt: `Build a tab title updater component.

* **Input Field** (\`data-testid="title-input"\`).
* **Effect**: Updates \`document.title\` in real time as the user types into the input field.`,
    testids: ["title-input"],
    markers: ["useEffect", "document.title"],
    reactSolution: `import { useEffect, useState } from "react";

export function App() {
  const [title, setTitle] = useState("");

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <input
      data-testid="title-input"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
}
`,
  },
  {
    slug: "fetch-users-loading",
    title: "Fetching Data with useEffect & Handling Loading States",
    difficulty: "medium",
    tags: ["react", "useEffect", "fetch", "loading"],
    prompt: `Build a component that fetches user profiles from a mock API on mount.

* **Loading Indicator** (\`data-testid="loading-spinner"\`): Visible while pending.
* **User List** (\`data-testid="user-list"\`): Displayed on success.
* **Error Banner** (\`data-testid="error-message"\`): Displayed if request fails.`,
    testids: ["loading-spinner", "user-list", "error-message"],
    markers: ["useEffect", "loading", "setTimeout"],
    reactSolution: `import { useEffect, useState } from "react";

const MOCK_USERS = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

function fetchUsers({ shouldFail }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error("Failed to fetch users"));
      else resolve(MOCK_USERS);
    }, 50);
  });
}

export function App() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldFail, setShouldFail] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setUsers(null);

    fetchUsers({ shouldFail })
      .then((data) => {
        if (!cancelled) {
          setUsers(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [shouldFail]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={shouldFail}
          onChange={(e) => setShouldFail(e.target.checked)}
        />
        Fail request
      </label>
      {loading && <div data-testid="loading-spinner">Loading...</div>}
      {error && <div data-testid="error-message">{error}</div>}
      {users && (
        <ul data-testid="user-list">
          {users.map((u) => (
            <li key={u.id}>{u.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
  },
  {
    slug: "use-local-storage",
    title: "Custom Hook Extraction (useLocalStorage)",
    difficulty: "medium",
    tags: ["react", "custom-hooks", "localStorage"],
    prompt: `Build a persistent text box using a custom hook \`useLocalStorage\`.

* **Input Field** (\`data-testid="persistent-input"\`).
* **Behavior**: Typing into input updates state and saves to \`localStorage\`. Page reload restores value from \`localStorage\`.`,
    testids: ["persistent-input"],
    markers: ["useLocalStorage", "localStorage"],
    reactSolution: `import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) setValue(stored);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore quota errors in tests */
    }
  }, [key, value, hydrated]);

  return [value, setValue];
}

export function App() {
  const [text, setText] = useLocalStorage("persistent-input", "");

  return (
    <input
      data-testid="persistent-input"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}
`,
  },
  {
    slug: "autofocus-search",
    title: "useRef for DOM Access",
    difficulty: "easy",
    tags: ["react", "useRef", "dom"],
    prompt: `Build an auto-focus search bar.

* **Search Input** (\`data-testid="search-input"\`).
* **Focus Button** (\`data-testid="focus-btn"\`): Clicking this programmatically focuses the search input using React \`useRef\`.`,
    testids: ["search-input", "focus-btn"],
    markers: ["useRef", ".focus("],
    reactSolution: `import { useRef } from "react";

export function App() {
  const inputRef = useRef(null);

  return (
    <div>
      <input data-testid="search-input" ref={inputRef} type="search" />
      <button
        data-testid="focus-btn"
        onClick={() => inputRef.current?.focus()}
      >
        Focus
      </button>
    </div>
  );
}
`,
  },
  {
    slug: "stopwatch-ref",
    title: "useRef for Mutable Values (Stopwatch)",
    difficulty: "medium",
    tags: ["react", "useRef", "timer"],
    prompt: `Build a basic stopwatch timer.

* **Timer Display** (\`data-testid="timer-display"\`): Shows elapsed time in seconds.
* **Start Button** (\`data-testid="start-btn"\`)
* **Stop Button** (\`data-testid="stop-btn"\`)
* **Implementation**: Store interval ID in a \`useRef\` so clears do not trigger unnecessary re-renders.`,
    testids: ["timer-display", "start-btn", "stop-btn"],
    markers: ["useRef", "setInterval", "clearInterval"],
    reactSolution: `import { useEffect, useRef, useState } from "react";

export function App() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function start() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }

  function stop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  return (
    <div>
      <span data-testid="timer-display">{seconds}</span>
      <button data-testid="start-btn" onClick={start}>
        Start
      </button>
      <button data-testid="stop-btn" onClick={stop}>
        Stop
      </button>
    </div>
  );
}
`,
  },
  {
    slug: "memo-prime-calculator",
    title: "useMemo for Costly Computations",
    difficulty: "medium",
    tags: ["react", "useMemo", "performance"],
    prompt: `Build a prime number calculator.

* **Number Input** (\`data-testid="number-input"\`).
* **Result Display** (\`data-testid="prime-result"\`).
* **Requirements**: Memoize the prime check calculation using \`useMemo\` so re-rendering unrelated sibling state doesn't re-run calculation.`,
    testids: ["number-input", "prime-result"],
    markers: ["useMemo", "isPrime"],
    reactSolution: `import { useMemo, useState } from "react";

function isPrime(n) {
  const num = Number(n);
  if (!Number.isInteger(num) || num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

export function App() {
  const [value, setValue] = useState("2");
  const [tick, setTick] = useState(0);

  const primeResult = useMemo(() => {
    return isPrime(value) ? "prime" : "not prime";
  }, [value]);

  return (
    <div>
      <input
        data-testid="number-input"
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <span data-testid="prime-result">{primeResult}</span>
      <button onClick={() => setTick((t) => t + 1)}>Rerender {tick}</button>
    </div>
  );
}
`,
  },
  {
    slug: "callback-memo-child",
    title: "useCallback for Performance Optimization",
    difficulty: "medium",
    tags: ["react", "useCallback", "memo"],
    prompt: `Build a parent component passing a memoized callback to a child button component wrapped in \`React.memo\`.

* **Parent Counter** (\`data-testid="parent-count"\`).
* **Child Button** (\`data-testid="child-action-btn"\`).
* **Requirement**: Verify the child component does NOT re-render when parent state updates unrelated to the callback.`,
    testids: ["parent-count", "child-action-btn"],
    markers: ["useCallback", "memo(", "ChildButton"],
    reactSolution: `import { memo, useCallback, useState } from "react";

const ChildButton = memo(function ChildButton({ onAction }) {
  return (
    <button data-testid="child-action-btn" onClick={onAction}>
      Child Action
    </button>
  );
});

export function App() {
  const [count, setCount] = useState(0);
  const [clicks, setClicks] = useState(0);

  const handleAction = useCallback(() => {
    setClicks((c) => c + 1);
  }, []);

  return (
    <div>
      <span data-testid="parent-count">{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>Inc parent</button>
      <ChildButton onAction={handleAction} />
      <span>Child clicks: {clicks}</span>
    </div>
  );
}
`,
  },
  {
    slug: "theme-context",
    title: "Context API (Theme Switcher)",
    difficulty: "medium",
    tags: ["react", "context", "theme"],
    prompt: `Build a light/dark theme provider and consumer.

* **Theme Provider**: Encloses the app state (\`light\` or \`dark\`).
* **Toggle Button** (\`data-testid="theme-toggle"\`).
* **Content Panel** (\`data-testid="content-panel"\`): Class or style shifts between light and dark backgrounds depending on Context value.`,
    testids: ["theme-toggle", "content-panel"],
    markers: ["createContext", "ThemeProvider", "useContext"],
    reactSolution: `import { createContext, useContext, useState } from "react";

const ThemeContext = createContext("light");

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Content() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <div>
      <button data-testid="theme-toggle" onClick={toggle}>
        Toggle theme
      </button>
      <div
        data-testid="content-panel"
        className={theme}
        style={{
          background: theme === "dark" ? "#222" : "#f5f5f5",
          color: theme === "dark" ? "#fff" : "#111",
          padding: 16,
        }}
      >
        Theme: {theme}
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <Content />
    </ThemeProvider>
  );
}
`,
  },
  {
    slug: "auth-context",
    title: "Context API (User Auth State)",
    difficulty: "medium",
    tags: ["react", "context", "auth"],
    prompt: `Build an AuthContext that tracks \`user\` and \`isAuthenticated\`.

* **Login Button** (\`data-testid="login-btn"\`): Sets \`isAuthenticated\` to true.
* **Logout Button** (\`data-testid="logout-btn"\`): Sets \`isAuthenticated\` to false.
* **User Greeting** (\`data-testid="user-greeting"\`): Displays "Logged in as [username]" or "Guest".`,
    testids: ["login-btn", "logout-btn", "user-greeting"],
    markers: ["AuthContext", "isAuthenticated", "Logged in as"],
    reactSolution: `import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: () => setUser({ username: "demo" }),
      logout: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function AuthPanel() {
  const { user, isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <div>
      <button data-testid="login-btn" onClick={login}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
      <p data-testid="user-greeting">
        {isAuthenticated ? \`Logged in as \${user.username}\` : "Guest"}
      </p>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AuthPanel />
    </AuthProvider>
  );
}
`,
  },
  {
    slug: "wizard-reducer",
    title: "useReducer for Complex State",
    difficulty: "medium",
    tags: ["react", "useReducer", "wizard"],
    prompt: `Build a multi-step wizard step tracker using \`useReducer\`.

* **Step Display** (\`data-testid="step-display"\`): Shows "Step X of 4".
* **Next Button** (\`data-testid="next-btn"\`)
* **Prev Button** (\`data-testid="prev-btn"\`)
* **Reducers**: Handle \`NEXT_STEP\`, \`PREV_STEP\`, and \`RESET\`.`,
    testids: ["step-display", "next-btn", "prev-btn"],
    markers: ["useReducer", "NEXT_STEP", "PREV_STEP", "RESET"],
    reactSolution: `import { useReducer } from "react";

const TOTAL = 4;

function reducer(state, action) {
  switch (action.type) {
    case "NEXT_STEP":
      return { step: Math.min(TOTAL, state.step + 1) };
    case "PREV_STEP":
      return { step: Math.max(1, state.step - 1) };
    case "RESET":
      return { step: 1 };
    default:
      return state;
  }
}

export function App() {
  const [state, dispatch] = useReducer(reducer, { step: 1 });

  return (
    <div>
      <p data-testid="step-display">
        Step {state.step} of {TOTAL}
      </p>
      <button
        data-testid="prev-btn"
        onClick={() => dispatch({ type: "PREV_STEP" })}
      >
        Prev
      </button>
      <button
        data-testid="next-btn"
        onClick={() => dispatch({ type: "NEXT_STEP" })}
      >
        Next
      </button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
    </div>
  );
}
`,
  },
  {
    slug: "error-boundary",
    title: "Error Boundaries",
    difficulty: "hard",
    tags: ["react", "error-boundary"],
    prompt: `Build a component wrapped in a React Error Boundary.

* **Buggy Component Button** (\`data-testid="crash-btn"\`): Throws an Error on click.
* **Fallback UI** (\`data-testid="error-fallback"\`): Renders "Something went wrong" when an error is caught by boundary.`,
    testids: ["crash-btn", "error-fallback"],
    markers: [
      "componentDidCatch",
      "getDerivedStateFromError",
      "Something went wrong",
    ],
    reactSolution: `import { Component, useState } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-fallback">Something went wrong</div>;
    }
    return this.props.children;
  }
}

function Buggy() {
  const [crash, setCrash] = useState(false);
  if (crash) throw new Error("Boom");
  return (
    <button data-testid="crash-btn" onClick={() => setCrash(true)}>
      Crash
    </button>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <Buggy />
    </ErrorBoundary>
  );
}
`,
  },
  {
    slug: "portal-tooltip",
    title: "Portals (React.createPortal)",
    difficulty: "hard",
    tags: ["react", "portals", "createPortal"],
    prompt: `Build a tooltip component that renders outside the parent DOM node into \`#modal-root\`.

* **Target Button** (\`data-testid="tooltip-target"\`).
* **Portal Tooltip** (\`data-testid="portal-tooltip"\`): Confirmed to be rendered attached to \`document.getElementById('modal-root')\`.`,
    testids: ["tooltip-target", "portal-tooltip"],
    markers: ["createPortal", "modal-root"],
    reactExtraFiles: {
      "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Base Frontend</title>
  </head>
  <body>
    <div id="root"></div>
    <div id="modal-root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,
    },
    reactSolution: `import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function App() {
  const [open, setOpen] = useState(false);
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  return (
    <div>
      <button
        data-testid="tooltip-target"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        Hover me
      </button>
      {open &&
        modalRoot &&
        createPortal(
          <div data-testid="portal-tooltip">Tooltip content</div>,
          modalRoot
        )}
    </div>
  );
}
`,
  },
  {
    slug: "uncontrolled-file-upload",
    title: "Uncontrolled Components with useRef",
    difficulty: "medium",
    tags: ["react", "useRef", "uncontrolled"],
    prompt: `Build a file upload form using uncontrolled inputs.

* **File Input** (\`data-testid="file-input"\`).
* **Submit Button** (\`data-testid="upload-btn"\`).
* **Feedback** (\`data-testid="file-name-display"\`): Read \`fileInputRef.current.files[0].name\` on submit and display it.`,
    testids: ["file-input", "upload-btn", "file-name-display"],
    markers: ["fileInputRef", "files?.[0]"],
    reactSolution: `import { useRef, useState } from "react";

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
`,
  },
  {
    slug: "forward-ref-input",
    title: "Forwarding Refs (React.forwardRef)",
    difficulty: "medium",
    tags: ["react", "forwardRef", "refs"],
    prompt: `Build a custom \`FancyInput\` component that forwards its ref to the underlying native \`<input>\`.

* **Parent Button** (\`data-testid="parent-focus-btn"\`).
* **FancyInput** (\`data-testid="fancy-input"\`): Receives focus directly when Parent Button is clicked.`,
    testids: ["parent-focus-btn", "fancy-input"],
    markers: ["forwardRef", "FancyInput"],
    reactSolution: `import { forwardRef, useRef } from "react";

const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input data-testid="fancy-input" ref={ref} {...props} />;
});

export function App() {
  const inputRef = useRef(null);

  return (
    <div>
      <FancyInput ref={inputRef} />
      <button
        data-testid="parent-focus-btn"
        onClick={() => inputRef.current?.focus()}
      >
        Focus input
      </button>
    </div>
  );
}
`,
  },
  {
    slug: "status-icon-switch",
    title: "Dynamic Component Rendering",
    difficulty: "easy",
    tags: ["react", "dynamic-components"],
    prompt: `Build a generic status icon switch component.

* **Props**: \`type\` ("success", "warning", "error").
* **Icon Container** (\`data-testid="status-icon"\`): Dynamically renders distinct sub-components/SVGs based on the \`type\` prop.`,
    testids: ["status-icon"],
    markers: ["success", "warning", "error"],
    reactSolution: `import { useState } from "react";

function SuccessIcon() {
  return (
    <svg width="24" height="24" aria-label="success">
      <circle cx="12" cy="12" r="10" fill="green" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="24" height="24" aria-label="warning">
      <polygon points="12,2 22,22 2,22" fill="orange" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="24" height="24" aria-label="error">
      <rect x="4" y="4" width="16" height="16" fill="red" />
    </svg>
  );
}

const ICONS = {
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

function StatusIcon({ type }) {
  const Icon = ICONS[type] || SuccessIcon;
  return (
    <div data-testid="status-icon">
      <Icon />
    </div>
  );
}

export function App() {
  const [type, setType] = useState("success");

  return (
    <div>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="success">success</option>
        <option value="warning">warning</option>
        <option value="error">error</option>
      </select>
      <StatusIcon type={type} />
    </div>
  );
}
`,
  },
  {
    slug: "click-outside-dropdown",
    title: "React Synthetic Events vs Native Events",
    difficulty: "medium",
    tags: ["react", "events", "click-outside"],
    prompt: `Build an element that detects clicks outside of itself.

* **Dropdown Container** (\`data-testid="dropdown-menu"\`).
* **Behavior**: Listen to global document click events; close dropdown if the click target is outside \`dropdown-menu\`.`,
    testids: ["dropdown-menu"],
    markers: ["addEventListener", "dropdown-menu", "contains"],
    reactSolution: `import { useEffect, useRef, useState } from "react";

export function App() {
  const [open, setOpen] = useState(true);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && (
        <div data-testid="dropdown-menu" ref={menuRef}>
          Menu item
        </div>
      )}
    </div>
  );
}
`,
  },
  {
    slug: "lazy-suspense-tabs",
    title: "React.lazy & Suspense",
    difficulty: "hard",
    tags: ["react", "lazy", "suspense"],
    prompt: `Build a dynamically imported tab module.

* **Tab Buttons**: "Overview", "Analytics".
* **Suspense Fallback** (\`data-testid="suspense-fallback"\`): Displays "Loading module..." while dynamic component chunk loads.`,
    testids: ["suspense-fallback"],
    markers: ["lazy(", "Suspense", "Loading module..."],
    reactExtraFiles: {
      "src/Overview.jsx": `export default function Overview() {
  return <div data-testid="overview-panel">Overview content</div>;
}
`,
      "src/Analytics.jsx": `export default function Analytics() {
  return <div data-testid="analytics-panel">Analytics content</div>;
}
`,
    },
    reactSolution: `import React, { lazy, Suspense, useState } from "react";

const Overview = lazy(() => import("./Overview.jsx"));
const Analytics = lazy(() => import("./Analytics.jsx"));

export function App() {
  const [tab, setTab] = useState("overview");

  return (
    <div>
      <button onClick={() => setTab("overview")}>Overview</button>
      <button onClick={() => setTab("analytics")}>Analytics</button>
      <Suspense
        fallback={
          <div data-testid="suspense-fallback">Loading module...</div>
        }
      >
        {tab === "overview" ? <Overview /> : <Analytics />}
      </Suspense>
    </div>
  );
}
`,
  },
  {
    slug: "use-debounce-search",
    title: "Custom Hook (useDebounce)",
    difficulty: "medium",
    tags: ["react", "custom-hooks", "debounce"],
    prompt: `Build an auto-completing search input using \`useDebounce\`.

* **Search Input** (\`data-testid="debounced-input"\`).
* **Debounced Value Display** (\`data-testid="debounced-value"\`): Updates 500ms after user stops typing.`,
    testids: ["debounced-input", "debounced-value"],
    markers: ["useDebounce", "500"],
    reactSolution: `import { useEffect, useState } from "react";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  return (
    <div>
      <input
        data-testid="debounced-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <span data-testid="debounced-value">{debouncedQuery}</span>
    </div>
  );
}
`,
  },
  {
    slug: "with-authorization-hoc",
    title: "High Order Components (HOC)",
    difficulty: "hard",
    tags: ["react", "hoc", "authorization"],
    prompt: `Build an \`withAuthorization\` HOC that wraps a \`Dashboard\` component.

* **Props**: \`role\`.
* **Authorized View** (\`data-testid="dashboard-view"\`): Rendered if \`role === 'admin'\`.
* **Unauthorized View** (\`data-testid="unauthorized-msg"\`): Rendered if \`role !== 'admin'\`.`,
    testids: ["dashboard-view", "unauthorized-msg"],
    markers: ["withAuthorization", "admin", "Dashboard"],
    reactSolution: `import { useState } from "react";

function Dashboard() {
  return <div data-testid="dashboard-view">Admin Dashboard</div>;
}

function withAuthorization(Wrapped) {
  return function AuthorizedComponent({ role, ...rest }) {
    if (role !== "admin") {
      return <div data-testid="unauthorized-msg">Unauthorized</div>;
    }
    return <Wrapped role={role} {...rest} />;
  };
}

const AuthorizedDashboard = withAuthorization(Dashboard);

export function App() {
  const [role, setRole] = useState("admin");

  return (
    <div>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="admin">admin</option>
        <option value="user">user</option>
      </select>
      <AuthorizedDashboard role={role} />
    </div>
  );
}
`,
  },
];
