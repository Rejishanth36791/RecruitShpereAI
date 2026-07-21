import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";
import type { ApiErrorShape, AuthResponse } from "@/types/api";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// --- 401 handling ---------------------------------------------------------
// The backend's /api/auth/refresh endpoint reads the caller's user id off the
// *existing* access token's claims (even though it's [AllowAnonymous], the JWT
// bearer handler still parses a still-valid-within-clockskew token if one is
// present). So refreshing only works within the ~15s clock-skew window after
// the access token's 15-minute lifetime — this mirrors the backend as written,
// not an ideal refresh design, but it's what the API supports today.

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { accessToken, refreshToken } = useAuthStore.getState();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<AuthResponse>(
      `${import.meta.env.VITE_API_BASE_URL || "/api"}/auth/refresh`,
      { refreshToken },
      { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined },
    );

    if (response.data.success && response.data.accessToken) {
      useAuthStore.getState().setSession({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      return response.data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }

      useAuthStore.getState().logout();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

/** Pull a human-readable message out of whatever shape the backend sent back. */
export function extractErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorShape | string | undefined;
    if (typeof data === "string" && data.trim().length > 0) return data;
    if (data && typeof data === "object") {
      if (data.message) return data.message;
      if (data.title) return data.title;
      if (data.errors) {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey) return data.errors[firstKey][0];
      }
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
