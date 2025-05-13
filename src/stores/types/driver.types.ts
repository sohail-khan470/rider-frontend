// src/stores/types/driver.types.ts

export type DriverStatus = "offline" | "online" | "on_trip";

export interface DriverLocation {
  id: number;
  driverId: number;
  lat: number;
  lng: number;
  updatedAt: string;
}

export interface DriverAvailability {
  id: number;
  driverId: number;
  startTime: string;
  endTime: string;
}

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: DriverStatus;
  vehicleInfo: string;
  companyId: number;
  location?: DriverLocation;
  availability?: DriverAvailability[];
  bookings?: any[]; // You can define a proper Booking type if needed
  company?: {
    id: number;
    name: string;
  };
  _count?: {
    bookings: number;
  };
  createdAt: string;
  updatedAt: string;
}
