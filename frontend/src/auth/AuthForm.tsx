import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthContext";

export function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "login") await login(email, password);
      else await register(email, username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>{mode === "login" ? "Log in" : "Create account"}</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      {mode === "register" && (
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      )}
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
      {error && <p role="alert">{error}</p>}
      <button type="submit">{mode === "login" ? "Log in" : "Register"}</button>
      <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Need an account?" : "Already have an account?"}
      </button>
    </form>
  );
}
