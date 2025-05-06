// src/api/types/company.types.ts
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

export interface CompanyResponse {
  success: boolean;
  message: string;
  data: Company[];
}
