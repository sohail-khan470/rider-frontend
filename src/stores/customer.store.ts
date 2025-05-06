// src/stores/customer.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { customerApi } from "../api/endpoints/customer.api";
import { Customer } from "./types/customer.types";
import { CustomerResponse } from "../api/types/customer.types";

type CustomerState = {
  customers: Customer[];
  currentCustomer: Customer | null;
  loading: boolean;
  error: string | null;
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
  getAllCustomers: () => Promise<void | CustomerResponse>;
};

export const useCustomerStore = create<CustomerState & CustomerActions>()(
  immer((set) => ({
    customers: [],
    currentCustomer: null,
    loading: false,
    error: null,

    fetchCustomers: async () => {
      set({ loading: true, error: null });
      try {
        const customers = await customerApi.getCompanyCustomers();
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
        const customer = await customerApi.updateCustomer(customerId, updates);
        set((state) => {
          const index = state.customers.findIndex(
            (c: Customer) => c.id === customerId
          );
          if (index !== -1) {
            state.customers[index] = customer;
          }
          if (state.currentCustomer?.id === customerId) {
            state.currentCustomer = customer;
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

    getAllCustomers: async () => {
      set({ loading: true, error: null });
      try {
        const response = await customerApi.getAllCustomers();
        set({ customers: response.data, loading: false });
        return response;
      } catch (error) {
        set({ error: "Failed to fetch all customers", loading: false });
        throw error; // Rethrow the error for further handling if needed
      }
    },
  }))
);
