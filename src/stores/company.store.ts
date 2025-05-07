import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { companyApi } from "../api/endpoints/company.api";
import { Company } from "./types/company.types";
import { CompanyState, CompanyActions } from "./types/company.types";

export const useCompanyStore = create<CompanyState & CompanyActions>()(
  persist(
    immer((set) => ({
      companies: [],
      currentCompany: null,
      companyAdmin: null,
      loading: false,
      error: null,

      registerCompany: async (companyData) => {
        set({ loading: true, error: null });
        try {
          const company = await companyApi.register(companyData);
          set({ currentCompany: company, loading: false });
        } catch (error) {
          set({ error: "Failed to register company", loading: false });
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
          const company = await companyApi.getProfile();
          set({ currentCompany: company, loading: false });
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

      // loginCompanyAdmin: async (email, password) => {
      //   set({ loading: true, error: null });
      //   try {
      //     const { admin, token } = await companyApi.login(email, password);
      //     localStorage.setItem("authToken", token);
      //     set({ companyAdmin: admin, loading: false });
      //   } catch (error) {
      //     set({ error: "Failed to login as admin", loading: false });
      //   }
      // },

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
    })),
    {
      name: "company-store", // Key in localStorage
      partialize: (state) => ({
        currentCompany: state.currentCompany,
        companyAdmin: state.companyAdmin,
      }),
    }
  )
);
