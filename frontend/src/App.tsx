import { AuthProvider, useAuth } from "./auth/AuthContext";
import { AuthForm } from "./auth/AuthForm";
import { TaskPage } from "./task/TaskPage";

function Shell() {
  const { user, loading, logout } = useAuth();
  if (loading) return <p className="text-center mt-5">Loading…</p>;
  if (!user) return <AuthForm />;
  return (
    <>
      <nav className="navbar navbar-expand bg-dark navbar-dark mb-4">
        <div className="container">
          <span className="navbar-brand">Tasks</span>
          <span className="navbar-text me-3">Signed in as {user.username}</span>
          <button className="btn btn-outline-light btn-sm" onClick={logout}>Log out</button>
        </div>
      </nav>
      <main className="container pb-5">
        <TaskPage />
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
