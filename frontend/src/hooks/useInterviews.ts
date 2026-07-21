import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { interviewsApi } from "@/api/interviews";
import type { ScheduleInterviewRequest, UpdateInterviewStatusRequest } from "@/types/api";

export const interviewKeys = {
  mine: ["interviews", "mine"] as const,
};

export function useMyInterviews() {
  return useQuery({ queryKey: interviewKeys.mine, queryFn: interviewsApi.getMine });
}

export function useScheduleInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ScheduleInterviewRequest) => interviewsApi.schedule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.mine });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useUpdateInterviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateInterviewStatusRequest }) =>
      interviewsApi.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interviewKeys.mine });
    },
  });
}
