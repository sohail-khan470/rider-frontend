// src/stores/auth.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { authApi } from "../api/endpoints/auth.api";
import { AuthState, AuthActions } from "./types/auth.types";
import { jwtDecode } from "jwt-decode";
export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set, get) => ({
    user: null,
    loading: false,
    error: null,
    initialized: false,
    type: "",
    token: "",

    // Actions
    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const response = await authApi.login(email, password);
        console.log(response);

        const type = response.data.user.type;
        const token = response.data.token;
        const data = jwtDecode(token) as any;
        localStorage.setItem("authToken", token);
        localStorage.setItem("role", data.role);

        set({
          user: response.data.user,
          type,
          token,
          loading: false,
        });
      } catch (error) {
        set({
          error: "Invalid  credentials, try again",
          loading: false,
        });
      }
    },

    initialize: async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        const decoded: any = jwtDecode(token);
        console.log(decoded);
        set({
          token,
          user: decoded,
          initialized: true,
        });
      } else {
        set({ initialized: true });
      }
    },

    getUserProfile: async () => {
      set({ loading: true, error: null });
      try {
        const response = (await authApi.getUserProfile()) as any;
        console.log(response);
        set({
          user: {
            ...response.data.profile.user, // Merge with profile data
          },
          loading: false,
        });
      } catch (error) {
        set({
          error: "Failed to fetch user profile",
          loading: false,
        });
      }
    },
    logout: () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      set({
        user: null,
        token: "",
        type: "",
      });
    },
  }))
);
