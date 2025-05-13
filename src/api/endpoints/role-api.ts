import apiClient from "../client";
import { Role } from "../types/role.types";
// import { Role } from "../types/role.types";

export const roleApi = {
  getAllRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get("/api/roles"); // Adjust if your route differs
    return response.data;
  },

  getRoleById: async (id: number): Promise<Role> => {
    const response = await apiClient.get(`/api/roles/${id}`);
    return response.data;
  },

  createRole: async (data: Omit<Role, "id">): Promise<Role> => {
    const response = await apiClient.post("/api/roles", data);
    return response.data;
  },

  updateRole: async (id: number, data: Partial<Role>): Promise<Role> => {
    const response = await apiClient.put(`/api/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/roles/${id}`);
  },
};
