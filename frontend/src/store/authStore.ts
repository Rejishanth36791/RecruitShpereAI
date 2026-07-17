import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserDto } from "@/types/api";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserDto | null;
  isAuthenticated: boolean;
  setSession: (payload: { accessToken: string; refreshToken?: string | null; user?: UserDto | null }) => void;
  updateUser: (user: UserDto) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({
          accessToken,
          refreshToken: refreshToken ?? get().refreshToken,
          user: user ?? get().user,
          isAuthenticated: true,
        }),
      updateUser: (user) => set({ user }),
      logout: () => set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "recruitsphere-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
