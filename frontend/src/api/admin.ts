import { apiClient } from "@/api/client";
import type { AdminAnalyticsResponse, UserDto } from "@/types/api";

export const adminApi = {
  getUsers: () => apiClient.get<UserDto[]>("/admin/users").then((r) => r.data),

  getAnalytics: () => apiClient.get<AdminAnalyticsResponse>("/admin/analytics").then((r) => r.data),
};
