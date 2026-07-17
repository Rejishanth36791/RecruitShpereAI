import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest, RegisterRequest } from "@/types/api";

/** Convenience selector hook for auth state. */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  return { user, isAuthenticated, logout, role: user?.role };
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: (data) => {
      if (data.success && data.accessToken) {
        setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user });
      }
    },
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
    onSuccess: (data) => {
      if (data.success && data.accessToken) {
        setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user });
      }
    },
  });
}
