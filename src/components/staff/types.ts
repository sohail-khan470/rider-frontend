export interface Staff {
  id: number;
  name: string;
  email: string;
  role: {
    id: number | string;
    name: string;
    permissions?: {
      permission: {
        name: string;
      };
    }[];
  };
  companyId?: number;
  // Add other fields as needed
}

export interface StaffFormValues {
  name: string;
  email: string;
  password: string;
  roleId: string | number;
  companyId: string | number;
}
