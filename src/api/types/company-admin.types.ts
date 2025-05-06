// src/api/types/company-admin.types.ts
export interface CompanyAdmin {
  id: number;
  name: string;
  email: string;
  password: string;
  companyId: number;
  company?: {
    id: number;
    name: string;
    email: string;
  };
}

// For store types
export interface CompanyAdminState {
  admins: CompanyAdmin[];
  currentAdmin: CompanyAdmin | null;
  loading: boolean;
  error: string | null;
}

export interface CompanyAdminActions {
  loginAdmin: (email: string, password: string) => Promise<void>;
  getAdminProfile: () => Promise<void>;
  updateAdminProfile: (updates: Partial<CompanyAdmin>) => Promise<void>;
  updateAdminPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  createAdmin: (
    adminData: Omit<CompanyAdmin, "id" | "companyId">
  ) => Promise<void>;
  fetchCompanyAdmins: () => Promise<void>;
  deleteAdmin: (adminId: number) => Promise<void>;
  logoutAdmin: () => void;
}
