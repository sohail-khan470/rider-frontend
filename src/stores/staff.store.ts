// stores/staffStore.ts
import { create } from "zustand";
import { staffApi } from "../api/endpoints/staffApi";
import { jwtDecode } from "jwt-decode";

interface Staff {
  id: number;
  name: string;
  email: string;
  role: {
    name: string;
  };
}

interface StaffState {
  staff: Staff[];
  selectedStaff: Staff | null;
  setStaff: (staff: Staff[]) => void;
  selectStaff: (staff: Staff) => void;
  clearSelectedStaff: () => void;
  updateStaff: (id: number, updatedStaff: Partial<Staff>) => void;
  removeStaff: (id: number) => void;
  fetchStaff: () => Promise<void>;
  getAdmin: (companyId: number) => Promise<void>;
  admin: any;
}

export const useStaffStore = create<StaffState>((set) => ({
  staff: [],
  selectedStaff: null,
  setStaff: (staff) => set({ staff }),
  selectStaff: (staff) => set({ selectedStaff: staff }),
  clearSelectedStaff: () => set({ selectedStaff: null }),
  admin: null,
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
      const user = localStorage.getItem("authToken") as any;
      const decoded: any = jwtDecode(user);
      const companyId = decoded.companyId;
      const response = await staffApi.getCompanyStaff(companyId);
      console.log(response, "^^^^^^^^^^^^");

      set({ staff: response });
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  },
  getAdmin: async (companyId: number) => {
    try {
      const response = await staffApi.getAdmin(companyId);
      console.log(response, "^^^^^^^^^^^^");
      set({ admin: response });
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  },
}));
