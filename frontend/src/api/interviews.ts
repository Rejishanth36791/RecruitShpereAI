import { apiClient } from "@/api/client";
import type { Interview, ScheduleInterviewRequest, UpdateInterviewStatusRequest } from "@/types/api";

export const interviewsApi = {
  schedule: (payload: ScheduleInterviewRequest) =>
    apiClient.post<Interview>("/interviews", payload).then((r) => r.data),

  getMine: () => apiClient.get<Interview[]>("/interviews/my").then((r) => r.data),

  updateStatus: (id: string, payload: UpdateInterviewStatusRequest) =>
    apiClient.put<{ message: string }>(`/interviews/${id}/status`, payload).then((r) => r.data),
};
