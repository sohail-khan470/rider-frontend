// src/api/types/driver.types.ts
export type DriverStatus = "offline" | "online" | "on_trip";

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: DriverStatus;
  vehicleInfo: string;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverAvailability {
  id: number;
  driverId: number;
  startTime: string;
  endTime: string;
}

export interface Location {
  id: number;
  driverId: number;
  lat: number;
  lng: number;
  updatedAt: string;
}

export interface DriverState {
  drivers: Driver[];
  currentDriver: Driver | null;
  availabilities: DriverAvailability[];
  location: Location | null;
  loading: boolean;
  error: string | null;
}

export interface DriverResponse {
  success: boolean;
  message: string;
  data: Driver[];
}

export interface DriverActions {
  fetchDrivers: () => Promise<void>;
  createDriver: (
    driverData: Omit<Driver, "id" | "createdAt" | "updatedAt" | "status">
  ) => Promise<void>;
  updateDriver: (driverId: number, updates: Partial<Driver>) => Promise<void>;
  deleteDriver: (driverId: number) => Promise<void>;
  getDriverProfile: () => Promise<void>;
  updateDriverStatus: (status: DriverStatus) => Promise<void>;
  updateDriverLocation: (location: {
    lat: number;
    lng: number;
  }) => Promise<void>;
  setAvailability: (availability: {
    startTime: string;
    endTime: string;
  }) => Promise<void>;
  getAvailabilities: () => Promise<void>;
  getAllDrivers: () => Promise<void>;
}
