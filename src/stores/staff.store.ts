import { create } from "zustand";
import { staffApi } from "../api/endpoints/staffApi";
import { jwtDecode } from "jwt-decode";
import { Staff, CreateStaff } from "./types/staff.types";

interface StaffState {
  staff: Staff[];
  selectedStaff: Staff | null;
  admin: Staff | null;
  setStaff: (staff: Staff[]) => void;
  selectStaff: (staff: Staff) => void;
  clearSelectedStaff: () => void;
  updateStaff: (id: number, updatedStaff: Partial<Staff>) => void;
  removeStaff: (id: number) => void;
  fetchStaff: () => Promise<void>;
  getAdmin: (companyId: number) => Promise<void>;
  addStaff: (staff: CreateStaff) => Promise<void>;
}

export const useStaffStore = create<StaffState>((set) => ({
  staff: [],
  selectedStaff: null,
  admin: null,

  setStaff: (staff) => set({ staff }),
  selectStaff: (staff) => set({ selectedStaff: staff }),
  clearSelectedStaff: () => set({ selectedStaff: null }),

  updateStaff: (id, updatedStaff) =>
    set((state) => ({
      staff: state.staff.map((staff) =>
        staff.id === id ? { ...staff, ...updatedStaff } : staff
      ),
    })),

  removeStaff: (id) =>
    set((state) => ({
      staff: state.staff.filter((staff) => staff.id !== id),
    })),

  fetchStaff: async () => {
    try {
      const user = localStorage.getItem("authToken");
      if (!user) throw new Error("No auth token found");

      const decoded: any = jwtDecode(user);
      const companyId = decoded.companyId;

      const response = (await staffApi.getCompanyStaff(companyId)) as any;
      set({ staff: response.data.users });
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  },

  addStaff: async (newStaff) => {
    try {
      const user = localStorage.getItem("authToken");
      if (!user) throw new Error("No auth token found");

      const decoded: any = jwtDecode(user);
      const companyId = decoded.companyId;

      const response = (await staffApi.addStaff(companyId, newStaff)) as any;

      set((state) => ({
        staff: [...state.staff, response.data],
      }));
    } catch (error) {
      console.error("Error adding staff:", error);
      throw error;
    }
  },

  getAdmin: async (companyId: number) => {
    try {
      const response = (await staffApi.getAdmin(companyId)) as any;
      set({ admin: response.data });
    } catch (error) {
      console.error("Error fetching admin:", error);
    }
  },
}));
