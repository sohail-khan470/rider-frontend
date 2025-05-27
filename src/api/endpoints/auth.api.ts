// src/api/endpoints/auth.api.ts
import apiClient from "../client";

import { SuperAdmin } from "../types/superadmin.types";
import { Company } from "../types/company.types";
import { CompanyAdmin } from "../types/company-admin.types";
import { Staff } from "../types/staff.types";
import { Customer } from "../types/customer.types";

export const authApi = {
  login: async (email: string, password: string): Promise<any> => {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });

    return response.data.data;
  },

  superAdminProfile: async (): Promise<SuperAdmin> => {
    const response = await apiClient.get("/super-admin/me");
    return response.data;
  },

  // Company Auth
  companyRegister: async (
    data: Omit<Company, "id" | "createdAt" | "isApproved">
  ): Promise<Company> => {
    const response = await apiClient.post("/companies/register", data);
    return response.data;
  },

  companyProfile: async (): Promise<Company> => {
    const response = await apiClient.get("/companies/me");
    return response.data;
  },

  // Company Admin Auth

  companyAdminProfile: async (): Promise<CompanyAdmin> => {
    const response = await apiClient.get("/company-admins/me");
    return response.data;
  },

  // Staff Auth

  staffProfile: async (): Promise<Staff> => {
    const response = await apiClient.get("/staff/me");
    return response.data;
  },

  // Customer Auth
  customerRegister: async (
    data: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ): Promise<Customer> => {
    const response = await apiClient.post("/customers/register", data);
    return response.data;
  },

  customerLogin: async (
    email: string,
    password: string
  ): Promise<{ customer: Customer; token: string }> => {
    const response = await apiClient.post("/customers/login", {
      email,
      password,
    });
    return response.data;
  },

  customerProfile: async (): Promise<Customer> => {
    const response = await apiClient.get("/customers/me");
    return response.data;
  },

  // Common
  logout: async (): Promise<void> => {
    await apiClient.post("/logout");
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post("/refresh-token");
    return response.data;
  },

  getUserProfile: async () => {
    const response = await apiClient.get("/auth/me");
    return response;
  },
};
