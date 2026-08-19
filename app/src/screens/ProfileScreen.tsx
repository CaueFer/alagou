import { AccountSummary } from "@/components/auth/AccountSummary";
import { AuthForm } from "@/components/auth/AuthForm";
import { FloatingBadge } from "@/components/ui/floating-badge";
import { useAuth } from "@/hooks/useAuth";

export function ProfileScreen() {
  const { user, isAuthenticated, status, error, login, register, loginWithGoogle, logout } = useAuth();

  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto"
      style={{ paddingBottom: "var(--bottom-nav-clearance)" }}
    >
      <FloatingBadge position="sticky">Perfil e Configurações</FloatingBadge>

      <div className="px-4 pt-4">
        {isAuthenticated && user ? (
          <AccountSummary user={user} onLogout={logout} />
        ) : (
          <AuthForm
            onLogin={login}
            onRegister={register}
            onGoogleCredential={loginWithGoogle}
            pending={status === "pending"}
            error={error}
          />
        )}
      </div>

      <div className="mt-8 px-4">
        <p className="text-xs text-muted-foreground">Notificações e exibição chegam em breve nesta aba.</p>
      </div>
    </div>
  );
}
