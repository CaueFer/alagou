import type { AuthCredentials, AuthSession } from "@/types/user";

export interface AuthClient {
  register(credentials: AuthCredentials): Promise<AuthSession>;
  login(credentials: AuthCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getSession(): AuthSession | null;
}
