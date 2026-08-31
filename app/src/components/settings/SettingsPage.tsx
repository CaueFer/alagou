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
      className="flex h-full w-full flex-col overflow-y-auto"
      style={{ paddingBottom: "var(--bottom-nav-clearance)" }}
    >
      <FloatingBadge position="sticky">Perfil e Configurações</FloatingBadge>

      <div className="flex flex-col gap-6 px-4 pt-4">
        {isAuthenticated && user ? (
          <>
            <AccountSummary user={user} onLogout={onLogout} />
            {user.role === "ADMIN" ? (
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-container-lowest p-4 shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Administração</span>
                  <span className="text-sm text-muted-foreground">Acesso ao painel de observabilidade da API.</span>
                </div>
                <Button variant="outline" onClick={onAdminClick}>
                  Abrir painel admin
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <AuthForm
            onLogin={onLogin}
            onRegister={onRegister}
            onGoogleCredential={onGoogleCredential}
            pending={status === "pending"}
            error={error}
          />
        )}

        <NotificationSettings />
        <DisplaySettings />
        <AppInfo />
      </div>
    </div>
  );
}
