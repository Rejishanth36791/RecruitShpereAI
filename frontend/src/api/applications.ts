import { apiClient } from "@/api/client";
import type { Application, SubmitApplicationRequest, UpdateApplicationStatusRequest } from "@/types/api";

export const applicationsApi = {
  submit: (payload: SubmitApplicationRequest) =>
    apiClient.post<Application>("/applications", payload).then((r) => r.data),

  getMine: () => apiClient.get<Application[]>("/applications/my").then((r) => r.data),

  getByJob: (jobPostingId: string) =>
    apiClient.get<Application[]>(`/applications/job/${jobPostingId}`).then((r) => r.data),

  getById: (id: string) => apiClient.get<Application>(`/applications/${id}`).then((r) => r.data),

  updateStatus: (id: string, payload: UpdateApplicationStatusRequest) =>
    apiClient.put<{ message: string }>(`/applications/${id}/status`, payload).then((r) => r.data),
};
