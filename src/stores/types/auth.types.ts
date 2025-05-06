// src/stores/types/auth.types.ts
import { AuthUser } from "../../api/types/auth.types";
import { Company } from "../../api/types/company.types";
import { Customer } from "../../api/types/customer.types";

export interface AuthState {
  user: AuthUser | null | string;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  role: string;
  token: any;
}

export interface AuthActions {
  // Super Admin
  superAdminLogin: (email: string, password: string) => Promise<void>;

  // Company
  companyRegister: (
    data: Omit<Company, "id" | "createdAt" | "isApproved">
  ) => Promise<Company>;

  companyLogin: (email: string, password: string) => Promise<void>;

  // Company Admin
  companyAdminLogin: (email: string, password: string) => Promise<void>;

  // Staff
  staffLogin: (email: string, password: string) => Promise<void>;

  // Customer
  customerRegister: (
    data: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ) => Promise<Customer>;

  customerLogin: (email: string, password: string) => Promise<void>;

  adminLogin: (email: string, password: string) => Promise<void>;

  // Common
  initializeAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
