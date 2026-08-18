import { useCallback, useState } from "react";
import { authClient } from "@/api";
import type { AuthCredentials, User } from "@/types/user";

export type AuthStatus = "idle" | "pending";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authClient.getSession()?.user ?? null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: AuthCredentials) => {
    setStatus("pending");
    setError(null);
    try {
      const session = await authClient.login(credentials);
      setUser(session.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
      throw err;
    } finally {
      setStatus("idle");
    }
  }, []);

  const register = useCallback(async (credentials: AuthCredentials) => {
    setStatus("pending");
    setError(null);
    try {
      const session = await authClient.register(credentials);
      setUser(session.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a conta.");
      throw err;
    } finally {
      setStatus("idle");
    }
  }, []);

  const logout = useCallback(async () => {
    await authClient.logout();
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    status,
    error,
    login,
    register,
    logout,
  } as const;
}
