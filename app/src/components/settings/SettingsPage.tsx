import { AccountSummary } from "@/components/auth/AccountSummary";
import { AuthForm } from "@/components/auth/AuthForm";
import { AppInfo } from "@/components/settings/AppInfo";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { Button } from "@/components/ui/button";
import { FloatingBadge } from "@/components/ui/floating-badge";
import type { AuthStatus } from "@/hooks/useAuth";
import type { AuthCredentials, User } from "@/types/user";

interface SettingsPageProps {
  user: User | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: string | null;
  onLogin: (credentials: AuthCredentials) => Promise<void>;
  onRegister: (credentials: AuthCredentials) => Promise<void>;
  onGoogleCredential: (idToken: string) => Promise<void>;
  onLogout: () => void;
  onAdminClick: () => void;
}

const heroClass =
  "flex min-h-[calc(100dvh-var(--bottom-nav-clearance)-4.5rem)] flex-col justify-center gap-6";

export function SettingsPage({
  user,
  isAuthenticated,
  status,
  error,
  onLogin,
  onRegister,
  onGoogleCredential,
  onLogout,
  onAdminClick,
}: SettingsPageProps) {
  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto pt-3"
      style={{ paddingBottom: "var(--bottom-nav-clearance)" }}
    >
      <FloatingBadge position="sticky">Perfil e Configurações</FloatingBadge>

      <div className="mx-auto flex w-full max-w-md flex-col gap-10 px-4 pt-6">
        {isAuthenticated && user ? (
          <div className={heroClass}>
            <AccountSummary user={user} onLogout={onLogout} />
            {user.role === "ADMIN" ? (
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Administração</span>
                  <span className="text-sm text-muted-foreground">Painel de observabilidade da API.</span>
                </div>
                <Button variant="outline" onClick={onAdminClick}>
                  Abrir
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className={heroClass}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Sua sessão</p>
              <p className="mt-1 text-2xl font-bold tracking-[-0.01em]">Anônimo</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Veja o mapa e crie relatos sem conta. Entre para acompanhar os seus.
              </p>
            </div>
            <AuthForm
              onLogin={onLogin}
              onRegister={onRegister}
              onGoogleCredential={onGoogleCredential}
              pending={status === "pending"}
              error={error}
            />
          </div>
        )}

        <NotificationSettings />
        <DisplaySettings />
        <AppInfo />
      </div>
    </div>
  );
}
