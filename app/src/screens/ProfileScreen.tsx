import { SettingsPage } from "@/components/settings/SettingsPage";
import { useAuth } from "@/hooks/useAuth";

export function ProfileScreen() {
  const { user, isAuthenticated, status, error, login, register, loginWithGoogle, logout } = useAuth();

  return (
    <SettingsPage
      user={user}
      isAuthenticated={isAuthenticated}
      status={status}
      error={error}
      onLogin={login}
      onRegister={register}
      onGoogleCredential={loginWithGoogle}
      onLogout={logout}
    />
  );
}