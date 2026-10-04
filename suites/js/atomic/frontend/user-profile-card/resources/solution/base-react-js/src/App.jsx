function UserProfileCard({ user }) {
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
