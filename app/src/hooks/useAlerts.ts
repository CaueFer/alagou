import { useQuery } from "@tanstack/react-query"
import { fetchAlerts } from "@/services/api"

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
    refetchInterval: 30_000,
  })
}
