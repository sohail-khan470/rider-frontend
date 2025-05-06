// src/stores/company-admin.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { companyAdminApi } from "../api/endpoints/company-admin.api";
import {
  CompanyAdminState,
  CompanyAdminActions,
  CompanyAdmin,
} from "./types/company-admin.types";

export const useCompanyAdminStore = create<
  CompanyAdminState & CompanyAdminActions
>()(
  immer((set) => ({
    admins: [],
    currentAdmin: null,
    loading: false,
    error: null,

    loginAdmin: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const { admin, token } = await companyAdminApi.login(email, password);
        localStorage.setItem("authToken", token);
        set({ currentAdmin: admin, loading: false });
      } catch (error) {
        set({ error: "Failed to login as company admin", loading: false });
      }
    },

    getAdminProfile: async () => {
      set({ loading: true, error: null });
      try {
        const admin = await companyAdminApi.getProfile();
        set({ currentAdmin: admin, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch admin profile", loading: false });
      }
    },

    updateAdminProfile: async (updates) => {
      set({ loading: true, error: null });
      try {
        const admin = await companyAdminApi.updateProfile(updates);
        set({ currentAdmin: admin, loading: false });
      } catch (error) {
        set({ error: "Failed to update profile", loading: false });
      }
    },

    updateAdminPassword: async (currentPassword, newPassword) => {
      set({ loading: true, error: null });
      try {
        await companyAdminApi.updatePassword(currentPassword, newPassword);
        set({ loading: false });
      } catch (error) {
        set({ error: "Failed to update password", loading: false });
      }
    },

    createAdmin: async (adminData) => {
      set({ loading: true, error: null });
      try {
        const admin = await companyAdminApi.createAdmin(adminData);
        set((state) => {
          state.admins.push(admin);
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to create admin", loading: false });
      }
    },

    fetchCompanyAdmins: async () => {
      set({ loading: true, error: null });
      try {
        const admins = await companyAdminApi.getCompanyAdmins();
        set({ admins, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch company admins", loading: false });
      }
    },

    deleteAdmin: async (adminId) => {
      set({ loading: true, error: null });
      try {
        await companyAdminApi.deleteAdmin(adminId);
        set((state) => {
          state.admins = state.admins.filter(
            (a: CompanyAdmin) => a.id !== adminId
          );
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to delete admin", loading: false });
      }
    },

    logoutAdmin: () => {
      localStorage.removeItem("authToken");
      set({ currentAdmin: null });
    },
  }))
);
