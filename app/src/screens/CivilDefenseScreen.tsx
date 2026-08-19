import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { civilDefenseClient } from "@/api";
import { CivilDefenseDetail } from "@/components/civil-defense/CivilDefenseDetail";
import { CivilDefenseList } from "@/components/civil-defense/CivilDefenseList";
import { Button } from "@/components/ui/button";
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
      <div className="pointer-events-none sticky top-4 z-10 flex justify-center px-4">
        <div className="rounded-2xl border border-white/40 bg-white/70 px-4 py-2 text-center shadow-lg backdrop-blur-md">
          <h1 className="text-sm font-semibold text-foreground">Defesa Civil</h1>
          <p className="text-xs text-muted-foreground">Avisos oficiais da Defesa Civil de Joinville</p>
        </div>
      </div>

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
