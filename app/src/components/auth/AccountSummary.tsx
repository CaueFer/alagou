import { LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

interface AccountSummaryProps {
  user: User;
  onLogout: () => void;
}

export function AccountSummary({ user, onLogout }: AccountSummaryProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        {user.pictureUrl ? (
          <img src={user.pictureUrl} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
        ) : (
          <UserCircle className="h-14 w-14 shrink-0 text-foreground" strokeWidth={1.25} />
        )}
        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Conta</span>
          <span className="mt-0.5 truncate text-xl font-bold tracking-[-0.01em]">{user.name ?? user.email}</span>
          {user.name ? <span className="truncate text-sm text-muted-foreground">{user.email}</span> : null}
        </div>
      </div>

      {user.createdAt ? (
        <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">Membro desde</span>
          <span className="text-sm font-medium tabular-nums">
            {new Date(user.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      ) : null}

      <Button variant="outline" className="w-full" onClick={onLogout}>
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </div>
  );
}
