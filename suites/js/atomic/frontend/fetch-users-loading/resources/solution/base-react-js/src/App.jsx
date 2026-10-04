import { useEffect, useState } from "react";

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
