// src/api/endpoints/auth.api.ts
import apiClient from "../client";

import { SuperAdmin } from "../types/superadmin.types";
import { Company } from "../types/company.types";
import { CompanyAdmin } from "../types/company-admin.types";
import { Staff } from "../types/staff.types";
import { Customer } from "../types/customer.types";
import { AuthResponse } from "../types/auth.types";

// import {
//   SuperAdmin,
//   Company,
//   CompanyAdmin,
//   Staff,
//   Customer,
// } from "../types/auth.types";

export const authApi = {
  // Super Admin Auth
  superAdminLogin: async (
    email: string,
    password: string
  ): Promise<{ admin: SuperAdmin; token: string }> => {
    const response = await apiClient.post("/super-admin/login", {
      email,
      password,
    });
    return response.data;
  },

  adminLogin: async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
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

  companyLogin: async (
    email: string,
    password: string
  ): Promise<{ company: Company; token: string }> => {
    const response = await apiClient.post("/companies/login", {
      email,
      password,
    });
    return response.data;
  },

  companyProfile: async (): Promise<Company> => {
    const response = await apiClient.get("/companies/me");
    return response.data;
  },

  // Company Admin Auth
  companyAdminLogin: async (
    email: string,
    password: string
  ): Promise<{ admin: CompanyAdmin; token: string }> => {
    const response = await apiClient.post("/company-admins/login", {
      email,
      password,
    });
    return response.data;
  },

  companyAdminProfile: async (): Promise<CompanyAdmin> => {
    const response = await apiClient.get("/company-admins/me");
    return response.data;
  },

  // Staff Auth
  staffLogin: async (
    email: string,
    password: string
  ): Promise<{ staff: Staff; token: string }> => {
    const response = await apiClient.post("/staff/login", { email, password });
    return response.data;
  },

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
};
