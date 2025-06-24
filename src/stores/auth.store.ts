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

        const type = response.user.type;
        const token = response.token;
        const data = jwtDecode(token) as any;
        localStorage.setItem("authToken", token);
        localStorage.setItem("role", data.role);

        console.log(response);

        set({
          user: response.user,
          type,
          token,
          loading: false,
        });
      } catch (error) {
        console.log(error);
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
        set({
          user: response.data.user, // Merge with profile data

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
    registerAdmin: async (user) => {
      set({ loading: true, error: null });
      try {
        const response = (await authApi.registerAdmin(user)) as any;
        console.log(response);

        set({ user: response.data, loading: false });
      } catch (error) {
        set({ error: "Failed to register user", loading: false });
      }
    },
  }))
);
