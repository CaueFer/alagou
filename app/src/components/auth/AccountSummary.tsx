import { LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

interface AccountSummaryProps {
  user: User;
  onLogout: () => void;
}

export function AccountSummary({ user, onLogout }: AccountSummaryProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border p-4">
      <div className="flex items-center gap-3">
        <UserCircle className="h-10 w-10 text-primary" strokeWidth={1.5} />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.email}</span>
          <span className="text-xs text-muted-foreground">
            Conta criada em {new Date(user.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={onLogout}>
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </div>
  );
}
