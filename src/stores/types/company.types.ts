// src/api/types/company.types.ts
export interface Company {
  media?: any;
  _count?: any;
  profile?: any;
  contact?: any;
  addresses: boolean;
  updatedAt(updatedAt?: any): import("react").ReactNode;
  id: number;
  name: string;
  email: string;
  password: string;
  isApproved: boolean;
  createdAt: string;
  timezone: string;
}

export interface CompanyAdmin {
  id: number;
  name: string;
  email: string;
  password: string;
  companyId: number;
}

export interface CompanyState {
  companies: Company[];
  currentCompany: Company | null;
  companyAdmin: CompanyAdmin | null;
  companyCustomers: any;
  loading: boolean;
  error: string | null;
}

export interface CompanyActions {
  registerCompany: (
    companyData: Omit<Company, "id" | "createdAt" | "isApproved">
  ) => Promise<void>;
  loginCompany: (email: string, password: string) => Promise<void>;
  getCompanyProfile: () => Promise<void>;
  updateCompanyProfile: (updates: Partial<Company>) => Promise<void>;
  approveCompany: (companyId: number) => Promise<void>;
  createCompanyAdmin: (
    adminData: Omit<CompanyAdmin, "id" | "companyId">
  ) => Promise<void>;
  getCompanyAdmin: () => Promise<void>;
  fetchAllCompanies: () => Promise<void>;
  getCompanyByAdminId: (id: number) => Promise<void>;
  getCompanyById: (id: number) => Promise<void>;
  logout: () => void;
  fetchCompanyCustomers: () => void;
  editCompany: (id: number, updates: Partial<Company>) => Promise<void>;
  deleteCompany: (id: number) => Promise<void>;
}
