import { create } from "zustand";
import { roleApi } from "../api/endpoints/role-api";
import { Role } from "./types/role.types";
interface RoleState {
  roles: Role[];
  selectedRole: Role | null;
  setRoles: (roles: Role[]) => void;
  selectRole: (role: Role) => void;
  clearSelectedRole: () => void;
  fetchRoles: () => Promise<void>;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  selectedRole: null,

  setRoles: (roles) => set({ roles }),
  selectRole: (role) => set({ selectedRole: role }),
  clearSelectedRole: () => set({ selectedRole: null }),

  fetchRoles: async () => {
    try {
      const response = (await roleApi.getAllRoles()) as any;
      set({ roles: response.data });
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  },
}));
