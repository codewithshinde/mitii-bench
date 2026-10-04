'use client';

import { createContext, useContext, useState } from "react";

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

export default function Page() {
  return (
    <ThemeProvider>
      <Content />
    </ThemeProvider>
  );
}
