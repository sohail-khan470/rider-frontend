// src/api/types/customer.types.ts
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
}
