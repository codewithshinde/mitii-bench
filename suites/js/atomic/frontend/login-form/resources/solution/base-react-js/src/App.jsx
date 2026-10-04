import { useState } from "react";

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
    setStatus(`Welcome, ${email}`);
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
