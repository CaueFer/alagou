import { ExternalLink } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { RiskBadge } from "@/components/civil-defense/RiskBadge";
import { formatFullTimestamp } from "@/lib/time";
import type { CivilDefenseNotice } from "@/types/civilDefense";

interface CivilDefenseDetailProps {
  notice: CivilDefenseNotice | null;
  open: boolean;
  onClose: () => void;
}

export function CivilDefenseDetail({ notice, open, onClose }: CivilDefenseDetailProps) {
  if (!notice) {
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <RiskBadge level={notice.riskLevel} />
          <DrawerTitle className="text-2xl font-semibold leading-8">{notice.title}</DrawerTitle>
          <p className="text-sm text-muted-foreground">
            Defesa Civil de Joinville · {formatFullTimestamp(notice.publishedAt)}
          </p>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-6">
          <p className="whitespace-pre-line text-base leading-6 text-foreground">{notice.content}</p>

          {notice.link && (
            <a
              href={notice.link}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-2"
            >
              Ver publicação original
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
