// src/stores/auth.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { authApi } from "../api/endpoints/auth.api";
import { AuthState, AuthActions } from "./types/auth.types";

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
        console.log("%%%%%%%%%");
        const response = await authApi.login(email, password);
        console.log(response.data);
        const type = response.data.user.type;
        const token = response.data.token;

        localStorage.setItem("type", type);
        localStorage.setItem("authToken", token);

        set({
          user: response.data.user,
          type,
          token,
          loading: false,
        });
      } catch (error) {
        set({
          error: "Invalid admin credentials",
          loading: false,
        });
      }
    },
  }))
);
