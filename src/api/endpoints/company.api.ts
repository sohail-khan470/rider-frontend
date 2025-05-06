// src/api/endpoints/company.api.ts
import apiClient from "../client";
import { Company, CompanyAdmin, CompanyResponse } from "../types/company.types";

export const companyApi = {
  // Super Admin endpoints
  getAllCompanies: async (): Promise<CompanyResponse> => {
    const response = await apiClient.get("/api/company");
    return response.data;
  },

  approveCompany: async (companyId: number): Promise<Company> => {
    const response = await apiClient.patch(
      `/super-admin/companies/${companyId}/approve`
    );
    return response.data;
  },

  // Company endpoints
  register: async (
    companyData: Omit<Company, "id" | "createdAt" | "isApproved">
  ): Promise<Company> => {
    const response = await apiClient.post("/companies/register", companyData);
    return response.data;
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ company: Company; token: string }> => {
    const response = await apiClient.post("/companies/login", {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async (): Promise<Company> => {
    const response = await apiClient.get("/companies/me");
    return response.data;
  },

  updateProfile: async (updates: Partial<Company>): Promise<Company> => {
    const response = await apiClient.patch("/companies/me", updates);
    return response.data;
  },

  // Company Admin endpoints
  createAdmin: async (
    adminData: Omit<CompanyAdmin, "id" | "companyId">
  ): Promise<CompanyAdmin> => {
    const response = await apiClient.post("/companies/admins", adminData);
    return response.data;
  },

  getAdmin: async (): Promise<CompanyAdmin> => {
    const response = await apiClient.get("/companies/admins/me");
    return response.data;
  },

  adminLogin: async (
    email: string,
    password: string
  ): Promise<{ admin: CompanyAdmin; token: string }> => {
    const response = await apiClient.post("/companies/admins/login", {
      email,
      password,
    });
    return response.data;
  },
};
