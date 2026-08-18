import type { AuthCredentials, AuthSession, User } from "@/types/user";
import type { AuthClient } from "@/api/authClient";
import { API_BASE_URL } from "@/lib/constants";

const SESSION_STORAGE_KEY = "alagou.auth.session";

interface AuthApiResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
  pictureUrl: string | null;
}

interface ErrorResponse {
  error: string;
  detail: string;
}

function readSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function writeSession(session: AuthSession | null) {
  if (session) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

function toSession(data: AuthApiResponse): AuthSession {
  const user: User = {
    id: String(data.userId),
    email: data.email,
    name: data.name,
    pictureUrl: data.pictureUrl ?? undefined,
  };
  return { user, token: data.token };
}

async function post(path: string, body: unknown): Promise<AuthApiResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ErrorResponse | null;
    throw new Error(errorBody?.detail ?? "Não foi possível completar a operação.");
  }

  return (await response.json()) as AuthApiResponse;
}

export const httpAuthClient: AuthClient = {
  async register(credentials: AuthCredentials) {
    const data = await post("/api/auth/register", {
      name: credentials.email.split("@")[0],
      email: credentials.email,
      password: credentials.password,
    });
    const session = toSession(data);
    writeSession(session);
    return session;
  },

  async login(credentials: AuthCredentials) {
    const data = await post("/api/auth/login", credentials);
    const session = toSession(data);
    writeSession(session);
    return session;
  },

  async loginWithGoogle(idToken: string) {
    const data = await post("/api/auth/google", { idToken });
    const session = toSession(data);
    writeSession(session);
    return session;
  },

  async logout() {
    writeSession(null);
  },

  getSession() {
    return readSession();
  },
};
