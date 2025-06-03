// src/stores/customer.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { customerApi } from "../api/endpoints/customer.api";
import { Customer } from "./types/customer.types";
import { CustomerResponse } from "../api/types/customer.types";
import { jwtDecode } from "jwt-decode";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type CustomerState = {
  customers: Customer[];
  currentCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null; // Add pagination state
};

type CustomerActions = {
  fetchCustomers: () => Promise<void>;
  createCustomer: (
    customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateCustomer: (
    customerId: number,
    updates: Partial<Customer>
  ) => Promise<void>;
  deleteCustomer: (customerId: number) => Promise<void>;
  registerCustomer: (
    customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  loginCustomer: (email: string, password: string) => Promise<void>;
  getCustomerProfile: () => Promise<void>;
  logout: () => void;
  getAllCustomers: (params: {
    companyId: number;
    page?: number;
    limit?: number;
    search?: string;
  }) => Promise<CustomerResponse>;
};

export const useCustomerStore = create<CustomerState & CustomerActions>()(
  immer((set) => ({
    customers: [],
    currentCustomer: null,
    loading: false,
    error: null,
    pagination: null, // Initialize pagination

    fetchCustomers: async () => {
      const token = localStorage.getItem("authToken") as any;
      const decoded = jwtDecode(token) as any;
      const companyId = decoded.companyId;
      set({ loading: true, error: null });
      try {
        const customers = await customerApi.getCompanyCustomers(companyId);
        set({ customers, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch customers", loading: false });
      }
    },

    createCustomer: async (customerData) => {
      set({ loading: true, error: null });
      try {
        const customer = await customerApi.createCustomer(customerData);
        set((state) => {
          state.customers.push(customer);
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to create customer", loading: false });
      }
    },

    updateCustomer: async (customerId, updates) => {
      set({ loading: true, error: null });
      try {
        const customer = (await customerApi.updateCustomer(
          customerId,
          updates
        )) as any;
        set((state) => {
          const index = state.customers.findIndex(
            (c: Customer) => c.id === customerId
          );
          if (index !== -1) {
            state.customers[index] = customer.data; // Adjust based on API response structure
          }
          if (state.currentCustomer?.id === customerId) {
            state.currentCustomer = customer.data;
          }
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to update customer", loading: false });
      }
    },

    deleteCustomer: async (customerId) => {
      set({ loading: true, error: null });
      try {
        await customerApi.deleteCustomer(customerId);
        set((state) => {
          state.customers = state.customers.filter(
            (c: Customer) => c.id !== customerId
          );
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to delete customer", loading: false });
      }
    },

    registerCustomer: async (customerData) => {
      set({ loading: true, error: null });
      try {
        const customer = await customerApi.register(customerData);
        set({ currentCustomer: customer, loading: false });
      } catch (error) {
        set({ error: "Failed to register customer", loading: false });
      }
    },

    loginCustomer: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const { customer, token } = await customerApi.login(email, password);
        localStorage.setItem("authToken", token);
        set({ currentCustomer: customer, loading: false });
      } catch (error) {
        set({ error: "Failed to login as customer", loading: false });
      }
    },

    getCustomerProfile: async () => {
      set({ loading: true, error: null });
      try {
        const customer = await customerApi.getProfile();
        set({ currentCustomer: customer, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch customer profile", loading: false });
      }
    },

    logout: () => {
      localStorage.removeItem("authToken");
      set({ currentCustomer: null });
    },

    getAllCustomers: async ({
      companyId,
      page = 1,
      limit = 10,
      search = "",
    }) => {
      set({ loading: true, error: null });
      try {
        const response = await customerApi.getAllCustomers({
          companyId,
          page,
          limit,
          search,
        });
        set({
          customers: response.data,
          pagination: response.pagination,
          loading: false,
        });
        return response;
      } catch (error) {
        set({ error: "Failed to fetch all customers", loading: false });
        throw error;
      }
    },
  }))
);
