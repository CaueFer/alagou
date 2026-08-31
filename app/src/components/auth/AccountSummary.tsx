import { LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

interface AccountSummaryProps {
  user: User;
  onLogout: () => void;
}

export function AccountSummary({ user, onLogout }: AccountSummaryProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface-container-lowest p-4 shadow-[0_1px_3px_0_rgba(11,28,48,0.08)]">
      <div className="flex items-center gap-3">
        {user.pictureUrl ? (
          <img src={user.pictureUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <UserCircle className="h-10 w-10 text-primary" strokeWidth={1.5} />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.name ?? user.email}</span>
          {user.name ? <span className="text-xs text-muted-foreground">{user.email}</span> : null}
          {user.createdAt ? (
            <span className="text-xs text-muted-foreground">
              Conta criada em {new Date(user.createdAt).toLocaleDateString("pt-BR")}
            </span>
          ) : null}
        </div>
      </div>
      <Button variant="outline" onClick={onLogout}>
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </div>
  );
}