// src/api/types/auth.types.ts
export interface SuperAdmin {
  id: number;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface Company {
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

export interface Staff {
  id: number;
  name: string;
  email: string;
  password: string;
  roleId: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type AuthUser =
  | { type: "superadmin"; data: SuperAdmin }
  | { type: "company"; data: Company }
  | { type: "company_admin"; data: CompanyAdmin }
  | { type: "staff"; data: Staff }
  | { type: "customer"; data: Customer };
