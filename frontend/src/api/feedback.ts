import { apiClient } from "@/api/client";
import type { Feedback, SubmitFeedbackRequest } from "@/types/api";

export const feedbackApi = {
  submit: (payload: SubmitFeedbackRequest) => apiClient.post<Feedback>("/feedback", payload).then((r) => r.data),

  getByApplication: (applicationId: string) =>
    apiClient.get<Feedback[]>(`/feedback/application/${applicationId}`).then((r) => r.data),
};
