// src/api/types/staff.types.ts
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

export interface StaffRole {
  id: number;
  name: string;
}
