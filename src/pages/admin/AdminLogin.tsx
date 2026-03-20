import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function AdminLogin() {
  const { user, isLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (user) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "w-full border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div
        className="w-full max-w-sm border border-border bg-card p-8"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div className="mb-8 text-center">
          <p
            className="text-2xl text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            FC
          </p>
          <p className="mt-2 text-xs text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
            PORTFOLIO MANAGER
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive" style={{ borderRadius: "var(--radius)" }}>
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@franciscocatarro.com"
              className={inputClasses}
              style={{ borderRadius: "var(--radius)" }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground" style={{ letterSpacing: "var(--label-tracking)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClasses}
              style={{ borderRadius: "var(--radius)" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-primary bg-transparent py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
            style={{ borderRadius: "var(--radius)", letterSpacing: "var(--label-tracking)" }}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </div>
    </div>
  );
}
