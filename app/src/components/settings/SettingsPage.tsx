import { useState } from "react";
import { LogIn, ShieldCheck, UserCircle } from "lucide-react";
import { AccountSummary } from "@/components/auth/AccountSummary";
import { AuthSheet } from "@/components/auth/AuthSheet";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { AppInfo } from "@/components/settings/AppInfo";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PwaInstallCard } from "@/components/settings/PwaInstallCard";
import { Button } from "@/components/ui/button";
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

const heroCardClass =
  "flex flex-col gap-5 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-5 shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]";

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
  const [authSheetOpen, setAuthSheetOpen] = useState(false);

  function closeSheetAfter<T>(action: (input: T) => Promise<void>) {
    return async (input: T) => {
      await action(input);
      setAuthSheetOpen(false);
    };
  }

  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto"
      style={{ paddingBottom: "var(--bottom-nav-clearance)" }}
    >
      <ScreenHeader
        title="Perfil"
        description="Sua conta e as preferências deste aparelho."
        className="mx-auto w-full max-w-md"
      />

      <div className="rise-in-stagger mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-3">
        {isAuthenticated && user ? (
          <div className={heroCardClass}>
            <AccountSummary user={user} onLogout={onLogout} />
            {user.role === "ADMIN" ? (
              <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/60 p-3.5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  <div className="flex flex-col">
                    <span className="text-base font-medium">Administração</span>
                    <span className="text-sm text-muted-foreground">Painel de observabilidade da API.</span>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={onAdminClick}>
                  Abrir
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className={heroCardClass}>
            <div className="flex items-center gap-4">
              <UserCircle className="h-14 w-14 shrink-0 text-foreground" strokeWidth={1.25} aria-hidden="true" />
              <div className="flex min-w-0 flex-col">
                <span className="text-sm text-muted-foreground">Sua sessão</span>
                <span className="text-xl font-bold tracking-[-0.01em]">Anônimo</span>
                <span className="text-sm text-muted-foreground">Veja o mapa e crie relatos sem conta.</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setAuthSheetOpen(true)}>
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Entrar ou criar conta
            </Button>
          </div>
        )}

        <NotificationSettings />
        <DisplaySettings />
        <PwaInstallCard />
        <AppInfo />
      </div>

      <AuthSheet
        open={authSheetOpen}
        onOpenChange={setAuthSheetOpen}
        onLogin={closeSheetAfter(onLogin)}
        onRegister={closeSheetAfter(onRegister)}
        onGoogleCredential={closeSheetAfter(onGoogleCredential)}
        pending={status === "pending"}
        error={error}
      />
    </div>
  );
}
