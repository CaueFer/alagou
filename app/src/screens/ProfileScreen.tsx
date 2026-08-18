import { AccountSummary } from "@/components/auth/AccountSummary";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";

export function ProfileScreen() {
  const { user, isAuthenticated, status, error, login, register, loginWithGoogle, logout } = useAuth();

  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto"
      style={{ paddingBottom: "var(--bottom-nav-clearance)" }}
    >
      <header className="px-4 pb-4 pt-6">
        <h1 className="text-lg font-semibold">Perfil e Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Entre com sua conta para acompanhar seus relatos de alagamento.
        </p>
      </header>

      <div className="px-4">
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
