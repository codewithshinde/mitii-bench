import { createContext, useContext, useMemo, useState } from "react";

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
        {isAuthenticated ? `Logged in as ${user.username}` : "Guest"}
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
