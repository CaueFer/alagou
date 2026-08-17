import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirmAlert, createAlert, reportClearRoad } from "@/services/api"

export function useCreateAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAlert,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  })
}

export function useConfirmAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: confirmAlert,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  })
}

export function useReportClearRoad() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reportClearRoad,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  })
}
