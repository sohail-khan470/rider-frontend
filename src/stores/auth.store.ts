// src/stores/auth.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { authApi } from "../api/endpoints/auth.api";
import { AuthUser } from "../api/types/auth.types";
import apiClient from "../api/client";
import { jwtDecode } from "jwt-decode";
import { AuthState, AuthActions } from "./types/auth.types";
import { companyApi } from "../api/endpoints/company.api";

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set, get) => ({
    user: null,
    loading: false,
    error: null,
    initialized: false,
    role: "",
    token: "",

    // Super Admin Auth
    superAdminLogin: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const response = await authApi.superAdminLogin(email, password);
        console.log(response, "&&&&&&&&&&");

        const { admin, token } = response;
        localStorage.setItem("authToken", token);
        set({
          user: { type: "superAdmin", data: admin },
          token: token,
          loading: false,
        });
      } catch (error) {
        set({
          error: "Invalid  admin credentials",
          loading: false,
        });
      }
    },

    // Company Auth
    companyRegister: async (data) => {
      set({ loading: true, error: null });
      try {
        const company = await authApi.companyRegister(data);
        set({ loading: false });
        return company;
      } catch (error) {
        set({
          error: "Company registration failed",
          loading: false,
        });
        throw error;
      }
    },

    companyLogin: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const { company, token } = await authApi.companyLogin(email, password);
        localStorage.setItem("authToken", token);
        localStorage.setItem("companyId", company.id.toString());
        set({
          user: { type: "companyAdmin", data: company },
          loading: false,
        });
      } catch (error) {
        set({
          error: "Invalid company credentials",
          loading: false,
        });
      }
    },

    // Company Admin Auth
    companyAdminLogin: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const { admin, token } = await authApi.companyAdminLogin(
          email,
          password
        );
        localStorage.setItem("authToken", token);
        localStorage.setItem("companyId", admin.companyId.toString());
        set({
          user: { type: "companyAdmin", data: admin },
          loading: false,
        });
      } catch (error) {
        set({
          error: "Invalid admin credentials",
          loading: false,
        });
      }
    },

    // Staff Auth
    staffLogin: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const { staff, token } = await authApi.staffLogin(email, password);
        localStorage.setItem("authToken", token);
        localStorage.setItem("companyId", staff.companyId.toString());
        set({
          user: { type: "staff", data: staff },
          loading: false,
        });
      } catch (error) {
        set({
          error: "Invalid staff credentials",
          loading: false,
        });
      }
    },

    // Customer Auth
    customerRegister: async (data) => {
      set({ loading: true, error: null });
      try {
        const customer = await authApi.customerRegister(data);
        set({ loading: false });
        return customer;
      } catch (error) {
        set({
          error: "Customer registration failed",
          loading: false,
        });
        throw error;
      }
    },

    customerLogin: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const { customer, token } = await authApi.customerLogin(
          email,
          password
        );
        localStorage.setItem("authToken", token);
        localStorage.setItem("companyId", customer.companyId.toString());
        set({
          user: { type: "customer", data: customer },
          loading: false,
        });
      } catch (error) {
        set({
          error: "Invalid customer credentials",
          loading: false,
        });
      }
    },

    // Common Auth
    initializeAuth: async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        set({ initialized: true, loading: false });
        return;
      }

      set({ loading: true });

      try {
        // Verify token and get user data
        const response = await apiClient.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const role = response.data.role;
        const user = response.data.admin;
        let userType = "";

        console.log(role, "******&&&&&");

        if (role === "superAdmin") {
          userType = "superAdmin";
        } else if (role === "companyAdmin") {
          userType = "companyAdmin";
        }
        set({
          user: { type: userType, data: user },
          token: token,
          initialized: true,
          loading: false,
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        localStorage.removeItem("companyId");
        set({
          user: null,
          token: "",
          initialized: true,
          loading: false,
          error: "Session expired. Please log in again.",
        });
      }
    },

    refreshToken: async () => {
      try {
        const { token } = await authApi.refreshToken();
        localStorage.setItem("authToken", token);
      } catch (error) {
        get().logout();
      }
    },

    logout: async () => {
      try {
        await authApi.logout();
      } finally {
        localStorage.removeItem("authToken");
        localStorage.removeItem("companyId");
        set({ user: null });
      }
    },

    clearError: () => {
      set({ error: null });
    },

    adminLogin: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const response = await authApi.adminLogin(email, password);
        const role = response.data.user.role;
        const token = response.data.token;
        const decoded = jwtDecode(token) as any;
        const data = { ...decoded };
        console.log("***********role", data.id);

        localStorage.setItem("authToken", token);
        localStorage.setItem("role", decoded.role);
        localStorage.setItem("userId", decoded.id);
        set({
          user: response.data.user,
          role,
          token,
          loading: false,
        });
      } catch (error) {
        set({
          error: "Invalid  admin credentials",
          loading: false,
        });
      }
    },
  }))
);
