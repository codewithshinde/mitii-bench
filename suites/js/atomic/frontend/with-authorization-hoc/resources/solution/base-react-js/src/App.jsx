import { useState } from "react";

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
