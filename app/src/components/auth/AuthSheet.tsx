import { AuthForm } from "@/components/auth/AuthForm";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { AuthCredentials } from "@/types/user";

interface AuthSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (credentials: AuthCredentials) => Promise<void>;
  onRegister: (credentials: AuthCredentials) => Promise<void>;
  onGoogleCredential: (idToken: string) => Promise<void>;
  pending: boolean;
  error: string | null;
}

export function AuthSheet({ open, onOpenChange, onLogin, onRegister, onGoogleCredential, pending, error }: AuthSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Entrar ou criar conta</DrawerTitle>
          <DrawerDescription>Acompanhe seus relatos em qualquer aparelho.</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6">
          <AuthForm
            onLogin={onLogin}
            onRegister={onRegister}
            onGoogleCredential={onGoogleCredential}
            pending={pending}
            error={error}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
