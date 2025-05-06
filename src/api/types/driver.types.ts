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
