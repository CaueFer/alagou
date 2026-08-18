export interface User {
  id: string;
  email: string;
  name?: string;
  pictureUrl?: string;
  createdAt?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
