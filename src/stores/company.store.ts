import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "react-toastify";
import { companyApi } from "../api/endpoints/company.api";
import { Company } from "./types/company.types";
import { CompanyState, CompanyActions } from "./types/company.types";
import { jwtDecode } from "jwt-decode";

export const useCompanyStore = create<CompanyState & CompanyActions>()(
  immer((set) => ({
    companies: [],
    companyCustomers: [],
    currentCompany: null,
    companyAdmin: null,
    loading: false,
    error: null,

    fetchCompanyCustomers: async () => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem("authToken") || " ";
        const decoded = jwtDecode(token) as any;
        const companyId = decoded.companyId;

        const response = (await companyApi.getCompanyCustomers(
          companyId
        )) as any;
        set({ companyCustomers: response.customers, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch customers", loading: false });
      }
    },

    registerCompany: async (companyData) => {
      set({ loading: true, error: null });
      try {
        const company = await companyApi.register(companyData);
        console.log(company);
        set((state) => {
          state.currentCompany = company;
          state.companies.push(company); // Add the new company to the companies array
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to register company", loading: false });
        throw error; // Re-throw the error to handle it in the component
      }
    },

    loginCompany: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const { company, token } = await companyApi.login(email, password);
        localStorage.setItem("authToken", token);
        set({ currentCompany: company, loading: false });
      } catch (error) {
        set({ error: "Failed to login", loading: false });
      }
    },

    getCompanyProfile: async () => {
      set({ loading: true, error: null });
      try {
        // const token = localStorage.getItem("authToken") || " ";
        // const decoded = jwtDecode(token) as any;
        // const companyId = decoded.companyId;

        const response = (await companyApi.getProfile()) as any;
        set({ currentCompany: response.company, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch company profile", loading: false });
      }
    },

    updateCompanyProfile: async (updates) => {
      set({ loading: true, error: null });
      try {
        const company = await companyApi.updateProfile(updates);
        set({ currentCompany: company, loading: false });
      } catch (error) {
        set({ error: "Failed to update company profile", loading: false });
      }
    },

    approveCompany: async (companyId) => {
      set({ loading: true, error: null });
      try {
        const company = await companyApi.approveCompany(companyId);
        set((state) => {
          const index = state.companies.findIndex(
            (c: Company) => c.id === companyId
          );
          if (index !== -1) {
            state.companies[index] = company;
          }
          state.loading = false;
        });
      } catch (error) {
        set({ error: "Failed to approve company", loading: false });
      }
    },

    createCompanyAdmin: async (adminData) => {
      set({ loading: true, error: null });
      try {
        const admin = await companyApi.createAdmin(adminData);
        set({ companyAdmin: admin, loading: false });
      } catch (error) {
        set({ error: "Failed to create company admin", loading: false });
      }
    },

    getCompanyAdmin: async () => {
      set({ loading: true, error: null });
      try {
        const admin = await companyApi.getAdmin();
        set({ companyAdmin: admin, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch admin profile", loading: false });
      }
    },

    fetchAllCompanies: async () => {
      set({ loading: true, error: null });
      try {
        const response = await companyApi.getAllCompanies();
        set({ companies: response.data, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch companies", loading: false });
      }
    },

    getCompanyByAdminId: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const response = await companyApi.getCompanyByAdminId(id);
        set({ currentCompany: response.data, loading: false });
      } catch (error) {
        set({ error: "Error getting company", loading: false });
      }
    },

    logout: () => {
      localStorage.removeItem("authToken");
      set({
        currentCompany: null,
        companyAdmin: null,
      });
    },

    getCompanyById: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const response = await companyApi.getCompanyById(id);
        set({ currentCompany: response.data, loading: false });
      } catch (error) {
        set({ error: "Error getting company", loading: false });
      }
    },
    editCompany: async (id: number, updates: any) => {
      set({ loading: true, error: null });
      try {
        const response = await companyApi.editCompany(id, updates);
        console.log(response.data);
        set({ currentCompany: response.data, loading: false });
      } catch (error) {
        set({ error: "Error updating company", loading: false });
      }
    },
    deleteCompany: async (id: number) => {
      set({ loading: true, error: null });
      try {
        await companyApi.deleteCompany(id);
        console.log("&&&&&&&&&");
        set((state) => {
          state.companies = state.companies.filter((c) => c.id !== id);
          state.loading = false;
        });
        toast.success("Company deleted successfully");
      } catch (error) {
        set({ error: "Error deleting company", loading: false });
      }
    },
  }))
);
