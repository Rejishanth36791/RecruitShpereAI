import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin";

export function useAdminUsers() {
  return useQuery({ queryKey: ["admin", "users"], queryFn: adminApi.getUsers });
}

export function useAdminAnalytics() {
  return useQuery({ queryKey: ["admin", "analytics"], queryFn: adminApi.getAnalytics });
}
