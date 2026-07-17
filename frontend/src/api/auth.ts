import { apiClient } from "@/api/client";
import type { AuthResponse, LoginRequest, RegisterRequest, UserDto } from "@/types/api";

export const authApi = {
  register: (payload: RegisterRequest) => apiClient.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  login: (payload: LoginRequest) => apiClient.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  me: () => apiClient.get<UserDto>("/auth/me").then((r) => r.data),
};
