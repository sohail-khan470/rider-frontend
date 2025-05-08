// src/api/endpoints/staff.api.ts
import apiClient from "../client";

import { Staff, StaffRole } from "../types/staff.types";

export const staffApi = {
  // Company endpoints
  getCompanyStaff: async (companyId: number): Promise<Staff[]> => {
    const response = await apiClient.get(`/api/company/${companyId}/users`);
    console.log(response, "^^^^^^^^^^^^");
    return response.data;
  },

  createStaff: async (
    staffData: Omit<Staff, "id" | "createdAt" | "updatedAt">
  ): Promise<Staff> => {
    const response = await apiClient.post("/companies/staff", staffData);
    return response.data;
  },

  updateStaff: async (
    staffId: number,
    updates: Partial<Staff>
  ): Promise<Staff> => {
    const response = await apiClient.patch(
      `/companies/staff/${staffId}`,
      updates
    );
    return response.data;
  },

  deleteStaff: async (staffId: number): Promise<void> => {
    await apiClient.delete(`/companies/staff/${staffId}`);
  },

  // Staff endpoints
  getStaffProfile: async (): Promise<Staff> => {
    const response = await apiClient.get("/staff/me");
    return response.data;
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ staff: Staff; token: string }> => {
    const response = await apiClient.post("/staff/login", { email, password });
    return response.data;
  },

  // Staff Role endpoints
  getRoles: async (): Promise<StaffRole[]> => {
    const response = await apiClient.get("/staff/roles");
    return response.data;
  },

  createRole: async (name: string): Promise<StaffRole> => {
    const response = await apiClient.post("/staff/roles", { name });
    return response.data;
  },

  getAdmin: async (companyId: number): Promise<Staff> => {
    const response = await apiClient.get(`/api/users/admins/${companyId}`);
    console.log(response, "^^^^^^^^^^^^");
    return response.data;
  },
};
