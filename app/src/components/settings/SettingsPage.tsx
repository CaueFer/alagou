import { AccountSummary } from "@/components/auth/AccountSummary";
import { AuthForm } from "@/components/auth/AuthForm";
import { AppInfo } from "@/components/settings/AppInfo";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
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
}: SettingsPageProps) {
  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto"
      style={{ paddingBottom: "var(--bottom-nav-clearance)" }}
    >
      <FloatingBadge position="sticky">Perfil e Configurações</FloatingBadge>

      <div className="flex flex-col gap-8 px-4 pt-4">
        {isAuthenticated && user ? (
          <AccountSummary user={user} onLogout={onLogout} />
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