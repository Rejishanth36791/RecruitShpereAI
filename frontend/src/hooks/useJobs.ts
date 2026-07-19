import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobsApi, type JobSearchParams } from "@/api/jobs";
import type { CreateJobRequest, UpdateJobRequest, UpdateJobStatusRequest } from "@/types/api";

export const jobKeys = {
  all: ["jobs"] as const,
  search: (params: JobSearchParams) => ["jobs", "search", params] as const,
  detail: (id: string) => ["jobs", "detail", id] as const,
  mine: ["jobs", "mine"] as const,
};

export function useAllJobs() {
  return useQuery({ queryKey: jobKeys.all, queryFn: jobsApi.getAll });
}

export function useJobSearch(params: JobSearchParams) {
  return useQuery({
    queryKey: jobKeys.search(params),
    queryFn: () => jobsApi.search(params),
  });
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: jobKeys.detail(id ?? ""),
    queryFn: () => jobsApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useMyJobs() {
  return useQuery({ queryKey: jobKeys.mine, queryFn: jobsApi.getMine });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateJobRequest) => jobsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.mine });
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateJobStatusRequest }) =>
      jobsApi.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.mine });
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateJobRequest }) => jobsApi.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.mine });
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.mine });
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}
