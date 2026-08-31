import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/segmented-control";
import type { AuthCredentials } from "@/types/user";

type Mode = "login" | "register";

interface AuthFormProps {
  onLogin: (credentials: AuthCredentials) => Promise<void>;
  onRegister: (credentials: AuthCredentials) => Promise<void>;
  onGoogleCredential: (idToken: string) => Promise<void>;
  pending: boolean;
  error: string | null;
}

const MODE_OPTIONS: SegmentedOption<Mode>[] = [
  { value: "login", label: "Entrar" },
  { value: "register", label: "Criar conta" },
];

export function AuthForm({ onLogin, onRegister, onGoogleCredential, pending, error }: AuthFormProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const credentials: AuthCredentials = { email, password };
    const submit = mode === "login" ? onLogin : onRegister;
    await submit(credentials).catch(() => {});
  }

  function handleGoogleCredential(idToken: string) {
    onGoogleCredential(idToken).catch(() => {});
  }

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl options={MODE_OPTIONS} value={mode} onValueChange={setMode} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "login" ? "Entrar" : "Criar conta"}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <GoogleSignInButton onCredential={handleGoogleCredential} disabled={pending} />

      <p className="text-xs text-muted-foreground">
        Login é opcional: você pode ver o mapa e criar relatos sem uma conta. Entrar permite acompanhar seus relatos.
      </p>
    </div>
  );
}