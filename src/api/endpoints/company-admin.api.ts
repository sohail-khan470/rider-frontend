// src/api/endpoints/company-admin.api.ts
import apiClient from "../client";
import { CompanyAdmin } from "../types/company.types";

export const companyAdminApi = {
  // Super Admin endpoints
  getAllAdmins: async (): Promise<CompanyAdmin[]> => {
    const response = await apiClient.get("/super-admin/company-admins");
    return response.data;
  },

  // Company endpoints
  createAdmin: async (
    adminData: Omit<CompanyAdmin, "id" | "companyId">
  ): Promise<CompanyAdmin> => {
    const response = await apiClient.post("/companies/admins", adminData);
    return response.data;
  },

  getCompanyAdmins: async (): Promise<CompanyAdmin[]> => {
    const response = await apiClient.get("/companies/admins");
    return response.data;
  },

  // Company Admin endpoints
  login: async (
    email: string,
    password: string
  ): Promise<{ admin: CompanyAdmin; token: string }> => {
    const response = await apiClient.post("/company-admins/login", {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async (): Promise<CompanyAdmin> => {
    const response = await apiClient.get("/company-admins/me");
    return response.data;
  },

  updateProfile: async (
    updates: Partial<CompanyAdmin>
  ): Promise<CompanyAdmin> => {
    const response = await apiClient.patch("/company-admins/me", updates);
    return response.data;
  },

  updatePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await apiClient.patch("/company-admins/password", {
      currentPassword,
      newPassword,
    });
  },

  deleteAdmin: async (adminId: number): Promise<void> => {
    await apiClient.delete(`/companies/admins/${adminId}`);
  },
};
