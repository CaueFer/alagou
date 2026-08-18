import { useCallback, useState } from "react";
import { alertClient } from "@/api";

type PendingAction = "confirm" | "clear" | null;

export function useConfirmation() {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const confirm = useCallback(async (id: string) => {
    setPendingAction("confirm");
    try {
      return await alertClient.confirm(id);
    } finally {
      setPendingAction(null);
    }
  }, []);

  const reportClear = useCallback(async (id: string) => {
    setPendingAction("clear");
    try {
      return await alertClient.reportClear(id);
    } finally {
      setPendingAction(null);
    }
  }, []);

  return { confirm, reportClear, pendingAction } as const;
}
