import { SearchX, ShieldCheck } from "lucide-react";
import { CivilDefenseCard } from "@/components/civil-defense/CivilDefenseCard";
import { CivilDefenseCardSkeleton } from "@/components/civil-defense/CivilDefenseCardSkeleton";
import type { CivilDefenseNotice } from "@/types/civilDefense";

const SKELETON_ROWS = 4;

interface CivilDefenseListProps {
  notices: CivilDefenseNotice[];
  loading: boolean;
  filtered: boolean;
}

export function CivilDefenseList({ notices, loading, filtered }: CivilDefenseListProps) {
  if (loading) {
    return (
      <div role="status" aria-label="Carregando avisos" className="flex flex-col gap-3 p-4">
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <CivilDefenseCardSkeleton key={index} withThumbnail={index % 2 === 0} />
        ))}
      </div>
    );
  }

  if (notices.length === 0 && filtered) {
    return (
      <div className="flex flex-col items-center gap-3 px-8 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-6 w-6 text-muted-foreground" strokeWidth={1.8} />
        </div>
        <p className="text-sm text-muted-foreground">Nenhum aviso para os filtros selecionados.</p>
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-8 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-status-safe-container">
          <ShieldCheck className="h-6 w-6 text-status-safe" strokeWidth={1.8} />
        </div>
        <p className="text-sm font-medium text-foreground">Nenhum aviso ativo no momento.</p>
        <p className="text-sm text-status-safe">Joinville está segura.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 pt-1">
      {notices.map((notice) => (
        <CivilDefenseCard key={notice.id} notice={notice} />
      ))}
    </div>
  );
}
