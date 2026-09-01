export interface User {
  id: string;
  email: string;
  name?: string;
  pictureUrl?: string;
  createdAt?: string;
  role: "USER" | "ADMIN";
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
