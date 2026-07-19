import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "@/api/applications";
import type { SubmitApplicationRequest, UpdateApplicationStatusRequest } from "@/types/api";

export const applicationKeys = {
  mine: ["applications", "mine"] as const,
  byJob: (jobId: string) => ["applications", "job", jobId] as const,
  detail: (id: string) => ["applications", "detail", id] as const,
};

export function useMyApplications() {
  return useQuery({ queryKey: applicationKeys.mine, queryFn: applicationsApi.getMine });
}

export function useApplicationsByJob(jobId: string | undefined) {
  return useQuery({
    queryKey: applicationKeys.byJob(jobId ?? ""),
    queryFn: () => applicationsApi.getByJob(jobId as string),
    enabled: Boolean(jobId),
  });
}

export function useApplication(id: string | undefined) {
  return useQuery({
    queryKey: applicationKeys.detail(id ?? ""),
    queryFn: () => applicationsApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitApplicationRequest) => applicationsApi.submit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.mine });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateApplicationStatusRequest }) =>
      applicationsApi.updateStatus(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: applicationKeys.detail(variables.id) });
    },
  });
}
