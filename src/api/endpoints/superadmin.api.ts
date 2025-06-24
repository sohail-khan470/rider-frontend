// src/api/endpoints/superadmin.api.ts
import apiClient from "../client";
import { SuperAdmin } from "../types/superadmin.types";

export const superAdminApi = {
  login: async (
    email: string,
    password: string
  ): Promise<{ admin: SuperAdmin; token: string }> => {
    const response = await apiClient.post("/super-admin/login", {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async (): Promise<SuperAdmin> => {
    const response = await apiClient.get("/super-admin/me");
    return response.data;
  },

  updateProfile: async (updates: Partial<SuperAdmin>): Promise<SuperAdmin> => {
    const response = await apiClient.patch("/super-admin/me", updates);
    return response.data;
  },

  getStatistics: async (): Promise<any> => {
    const response = await apiClient.get("/dashboard-stats");
    console.log(response);
    return response.data;
  },
};
