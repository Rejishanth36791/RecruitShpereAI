import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feedbackApi } from "@/api/feedback";
import type { SubmitFeedbackRequest } from "@/types/api";

export const feedbackKeys = {
  byApplication: (applicationId: string) => ["feedback", "application", applicationId] as const,
};

export function useFeedbackByApplication(applicationId: string | undefined) {
  return useQuery({
    queryKey: feedbackKeys.byApplication(applicationId ?? ""),
    queryFn: () => feedbackApi.getByApplication(applicationId as string),
    enabled: Boolean(applicationId),
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitFeedbackRequest) => feedbackApi.submit(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.byApplication(variables.applicationId) });
    },
  });
}
