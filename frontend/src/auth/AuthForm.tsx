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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <form className="card shadow-sm" onSubmit={submit}>
            <div className="card-body">
              <h2 className="card-title h4 mb-3">{mode === "login" ? "Log in" : "Create account"}</h2>
              <div className="mb-3">
                <input className="form-control" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              {mode === "register" && (
                <div className="mb-3">
                  <input className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
              )}
              <div className="mb-3">
                <input className="form-control" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              </div>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <button className="btn btn-primary w-100" type="submit">{mode === "login" ? "Log in" : "Register"}</button>
              <button className="btn btn-link w-100 mt-2" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "Need an account?" : "Already have an account?"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
