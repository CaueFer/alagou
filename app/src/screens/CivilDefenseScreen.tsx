import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { civilDefenseClient } from "@/api";
import { CivilDefenseDetail } from "@/components/civil-defense/CivilDefenseDetail";
import { CivilDefenseList } from "@/components/civil-defense/CivilDefenseList";
import { Button } from "@/components/ui/button";
import { FloatingBadge } from "@/components/ui/floating-badge";
import type { CivilDefenseNotice } from "@/types/civilDefense";

type CivilDefenseStatus = "loading" | "ready" | "error";

export function CivilDefenseScreen() {
  const [notices, setNotices] = useState<CivilDefenseNotice[]>([]);
  const [status, setStatus] = useState<CivilDefenseStatus>("loading");
  const [selectedNotice, setSelectedNotice] = useState<CivilDefenseNotice | null>(null);

  const fetchNotices = useCallback(async () => {
    try {
      setStatus("loading");
      const data = await civilDefenseClient.listNotices();
      setNotices(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <div className="relative h-full w-full overflow-y-auto" style={{ paddingBottom: "var(--bottom-nav-clearance)" }}>
      <FloatingBadge position="sticky">Defesa Civil</FloatingBadge>

      <div className="pt-16">
        {status === "error" && (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">Não foi possível carregar os avisos</p>
            <Button variant="outline" onClick={fetchNotices}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        {(status !== "error" || notices.length > 0) && (
          <CivilDefenseList notices={notices} loading={status === "loading"} onSelect={setSelectedNotice} />
        )}
      </div>

      <CivilDefenseDetail
        notice={selectedNotice}
        open={selectedNotice !== null}
        onClose={() => setSelectedNotice(null)}
      />
    </div>
  );
}
