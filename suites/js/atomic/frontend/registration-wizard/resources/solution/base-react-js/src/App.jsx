import { useState } from "react";

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
