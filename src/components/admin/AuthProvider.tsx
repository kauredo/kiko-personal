import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AuthContext } from "@/hooks/useAuth";

const TOKEN_KEY = "kiko_admin_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY),
  );

  const loginMutation = useMutation(api.auth.login);
  const logoutMutation = useMutation(api.auth.logout);
  const me = useQuery(api.auth.me, token ? { token } : "skip");

  const isLoading = token !== null && me === undefined;

  // If token is invalid, clear it
  useEffect(() => {
    if (token && me === null) {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    }
  }, [token, me]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginMutation({ email, password });
      localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
    },
    [loginMutation],
  );

  const logout = useCallback(async () => {
    if (token) {
      await logoutMutation({ token });
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, [token, logoutMutation]);

  const user = me ? { name: me.name, email: me.email } : null;

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
