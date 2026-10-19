import { AuthProvider, useAuth } from "./auth/AuthContext";
import { AuthForm } from "./auth/AuthForm";
import { TaskPage } from "./task/TaskPage";

function Shell() {
  const { user, loading, logout } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (!user) return <AuthForm />;
  return (
    <main>
      <header>
        <span>Signed in as {user.username}</span>
        <button onClick={logout}>Log out</button>
      </header>
      <TaskPage />
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
