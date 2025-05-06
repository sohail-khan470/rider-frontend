// src/stores/staff.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { staffApi } from "../api/endpoints/staff.api";
import { Staff, StaffRole } from "./types/staff.types";

type StaffState = {
  staffList: Staff[];
  currentStaff: Staff | null;
  roles: StaffRole[];
  loading: boolean;
  error: string | null;
};

type StaffActions = {
  fetchStaff: () => Promise<void>;
  createStaff: (
    staffData: Omit<Staff, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateStaff: (staffId: number, updates: Partial<Staff>) => Promise<void>;
  deleteStaff: (staffId: number) => Promise<void>;
  loginStaff: (email: string, password: string) => Promise<void>;
  getStaffProfile: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  createRole: (name: string) => Promise<void>;
  logout: () => void;
};

export const useStaffStore = create<StaffState & StaffActions>()(
  immer((set) => ({
    staffList: [],
    currentStaff: null,
    roles: [],
    loading: false,
    error: null,

    fetchStaff: async () => {
      set({ loading: true, error: null });
      try {
        const staff = await staffApi.getCompanyStaff();
        set({ staffList: staff, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch staff", loading: false });
      }
    },

    createStaff: async (staffData) => {
      set({ loading: true, error: null });
      try {
        const staff = await staffApi.createStaff(staffData);
        set((state) => {
          state.staffList.push(staff);
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to create staff", loading: false });
      }
    },

    updateStaff: async (staffId, updates) => {
      set({ loading: true, error: null });
      try {
        const staff = await staffApi.updateStaff(staffId, updates);
        set((state) => {
          const index = state.staffList.findIndex(
            (s: Staff) => s.id === staffId
          );
          if (index !== -1) {
            state.staffList[index] = staff;
          }
          if (state.currentStaff?.id === staffId) {
            state.currentStaff = staff;
          }
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to update staff", loading: false });
      }
    },

    deleteStaff: async (staffId) => {
      set({ loading: true, error: null });
      try {
        await staffApi.deleteStaff(staffId);
        set((state) => {
          state.staffList = state.staffList.filter(
            (s: Staff) => s.id !== staffId
          );
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to delete staff", loading: false });
      }
    },

    loginStaff: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const { staff, token } = await staffApi.login(email, password);
        localStorage.setItem("authToken", token);
        set({ currentStaff: staff, loading: false });
      } catch (error) {
        set({ error: "Failed to login as staff", loading: false });
      }
    },

    getStaffProfile: async () => {
      set({ loading: true, error: null });
      try {
        const staff = await staffApi.getStaffProfile();
        set({ currentStaff: staff, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch staff profile", loading: false });
      }
    },

    fetchRoles: async () => {
      set({ loading: true, error: null });
      try {
        const roles = await staffApi.getRoles();
        set({ roles, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch roles", loading: false });
      }
    },

    createRole: async (name) => {
      set({ loading: true, error: null });
      try {
        const role = await staffApi.createRole(name);
        set((state) => {
          state.roles.push(role);
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to create role", loading: false });
      }
    },

    logout: () => {
      localStorage.removeItem("authToken");
      set({ currentStaff: null });
    },
  }))
);
