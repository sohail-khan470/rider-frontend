// store/types/booking.types.ts

export type BookingStatus =
  | "pending"
  | "accepted"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  companyId: number;
}

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "offline" | "online" | "on_trip";
  vehicleInfo: string;
  companyId: number;
  cityId: number;
}

export interface Booking {
  id: number;
  customerId: number;
  driverId?: number | null;
  companyId: number;
  pickup: string;
  dropoff: string;
  status: BookingStatus;
  fare?: number | null;
  requestedAt: string | Date;

  // Related entities (these would be populated by your API)
  customer?: Customer;
  driver?: Driver;
}
