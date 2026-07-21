import { apiClient } from "@/api/client";
import type { CreateJobRequest, JobPosting, UpdateJobRequest, UpdateJobStatusRequest } from "@/types/api";

export interface JobSearchParams {
  searchTerm?: string;
  location?: string;
  status?: string;
}

export const jobsApi = {
  getAll: () => apiClient.get<JobPosting[]>("/jobpostings").then((r) => r.data),

  getById: (id: string) => apiClient.get<JobPosting>(`/jobpostings/${id}`).then((r) => r.data),

  search: (params: JobSearchParams) =>
    apiClient.get<JobPosting[]>("/jobpostings/search", { params }).then((r) => r.data),

  getMine: () => apiClient.get<JobPosting[]>("/jobpostings/recruiter").then((r) => r.data),

  create: (payload: CreateJobRequest) => apiClient.post<JobPosting>("/jobpostings", payload).then((r) => r.data),

  update: (id: string, payload: UpdateJobRequest) =>
    apiClient.put<JobPosting>(`/jobpostings/${id}`, payload).then((r) => r.data),

  remove: (id: string) => apiClient.delete<{ message: string }>(`/jobpostings/${id}`).then((r) => r.data),

  updateStatus: (id: string, payload: UpdateJobStatusRequest) =>
    apiClient.put<{ message: string }>(`/jobpostings/${id}/status`, payload).then((r) => r.data),
};
