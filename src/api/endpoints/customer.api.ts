// src/api/endpoints/customer.api.ts
import apiClient from "../client";
import { Customer, CustomerResponse } from "../types/customer.types";

export const customerApi = {
  // Company endpoints
  getCompanyCustomers: async (companyId: number): Promise<Customer[]> => {
    const response = await apiClient.get(`/api/company/${companyId}/customers`);
    console.log(response);
    return response.data;
  },

  createCustomer: async (
    customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ): Promise<Customer> => {
    const response = await apiClient.post(
      "/api/company/customers",
      customerData
    );
    return response.data;
  },

  updateCustomer: async (
    customerId: number,
    updates: Partial<Customer>
  ): Promise<Customer> => {
    const response = await apiClient.patch(
      `/companies/customers/${customerId}`,
      updates
    );
    return response.data;
  },

  deleteCustomer: async (customerId: number): Promise<void> => {
    await apiClient.delete(`/companies/customers/${customerId}`);
  },

  // Customer endpoints
  register: async (
    customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ): Promise<Customer> => {
    const response = await apiClient.post("/customers/register", customerData);
    return response.data;
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ customer: Customer; token: string }> => {
    const response = await apiClient.post("/customers/login", {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async (): Promise<Customer> => {
    const response = await apiClient.get("/customers/me");
    return response.data;
  },

  getAllCustomers: async (): Promise<CustomerResponse> => {
    const response = await apiClient.get("/api/customers/getAll");
    return response.data;
  },
};
