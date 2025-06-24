// src/stores/types/auth.types.ts
import { AuthUser } from "../../api/types/auth.types";

export interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  type: string;
  token: any;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  initialize: () => Promise<void>;
  getUserProfile: () => Promise<void>;
  registerAdmin: (admin: any) => Promise<void>;

  // Common
  // initializeAuth: () => Promise<void>;
  // refreshToken: () => Promise<void>;
  logout: () => void;
  // clearError: () => void;
}
