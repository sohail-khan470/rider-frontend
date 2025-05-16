export type DriverStatus = "offline" | "online" | "on_trip";

export type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: DriverStatus;
  vehicleInfo: string;
  companyId: number;
  cityId: number;
  timezone?: string;
  availability?: DriverAvailability;
  bookings?: any;
  company?: {
    id: number;
    name: string;
  };
  city?: {
    id: number;
    name: string;
  };
  location?: {
    id: number;
    lat: number;
    lng: number;
  };
  _count?: {
    bookings: number;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type DriverAvailability = {
  id: number;
  startTime: string;
  endTime: string;
  driverId: number;
};

export type CreateDriverData = {
  name: string;
  email: string;
  phone: string;
  vehicleInfo: string;
  companyId: number;
  cityId: number;
  status?: DriverStatus;
  timezone?: string;
};

export type UpdateDriverData = Partial<CreateDriverData>;

export type LocationData = {
  lat: number;
  lng: number;
};

export type AvailabilityData = {
  driverId: number;
  startTime: string;
  endTime: string;
};
