import type { AuthCredentials, AuthSession, User } from "@/types/user";
import type { AuthClient } from "@/api/authClient";

const SESSION_STORAGE_KEY = "alagou.auth.session";
const SIMULATED_LATENCY_MS = 400;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface StoredUser extends User {
  password: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId(): string {
  return `user-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function generateToken(): string {
  return `mock-token-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
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

function toUser(stored: StoredUser): User {
  const { password: _password, ...user } = stored;
  return user;
}

function validateCredentials({ email, password }: AuthCredentials) {
  if (!EMAIL_PATTERN.test(email)) {
    throw new Error("Informe um e-mail válido.");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }
}

let users: StoredUser[] = [
  {
    id: "seed-user-1",
    email: "demo@alagou.app",
    password: "alagou123",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60_000).toISOString(),
  },
];

export const mockAuthClient: AuthClient = {
  async register(credentials) {
    await delay(SIMULATED_LATENCY_MS);
    validateCredentials(credentials);
    const email = credentials.email.trim().toLowerCase();
    if (users.some((user) => user.email === email)) {
      throw new Error("Este e-mail já está cadastrado.");
    }
    const stored: StoredUser = {
      id: generateId(),
      email,
      password: credentials.password,
      createdAt: new Date().toISOString(),
    };
    users = [...users, stored];
    const session: AuthSession = { user: toUser(stored), token: generateToken() };
    writeSession(session);
    return session;
  },

  async login(credentials) {
    await delay(SIMULATED_LATENCY_MS);
    const email = credentials.email.trim().toLowerCase();
    const stored = users.find((user) => user.email === email);
    if (!stored || stored.password !== credentials.password) {
      throw new Error("E-mail ou senha incorretos.");
    }
    const session: AuthSession = { user: toUser(stored), token: generateToken() };
    writeSession(session);
    return session;
  },

  async logout() {
    await delay(SIMULATED_LATENCY_MS);
    writeSession(null);
  },

  getSession() {
    return readSession();
  },
};
