// src/stores/superadmin.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { superAdminApi } from "../api/endpoints/superadmin.api";
import { SuperAdmin } from "../api/types/superadmin.types";

type SuperAdminState = {
  superAdmin: SuperAdmin | null;
  loading: boolean;
  error: string | null;
};

type SuperAdminActions = {
  login: (email: string, password: string) => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (updates: Partial<SuperAdmin>) => Promise<void>;
  logout: () => void;
};

export const useSuperAdminStore = create<SuperAdminState & SuperAdminActions>()(
  immer((set) => ({
    superAdmin: null,
    loading: false,
    error: null,

    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const { admin, token } = await superAdminApi.login(email, password);
        localStorage.setItem("authToken", token);
        set({ superAdmin: admin, loading: false });
      } catch (error) {
        set({ error: "Failed to login as super admin", loading: false });
      }
    },

    getProfile: async () => {
      set({ loading: true, error: null });
      try {
        const admin = await superAdminApi.getProfile();
        set({ superAdmin: admin, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch profile", loading: false });
      }
    },

    updateProfile: async (updates) => {
      set({ loading: true, error: null });
      try {
        const admin = await superAdminApi.updateProfile(updates);
        set({ superAdmin: admin, loading: false });
      } catch (error) {
        set({ error: "Failed to update profile", loading: false });
      }
    },

    logout: () => {
      localStorage.removeItem("authToken");
      set({ superAdmin: null });
    },
  }))
);
