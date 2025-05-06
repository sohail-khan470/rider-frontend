// src/api/types/booking.types.ts
export type BookingStatus =
  | "pending"
  | "accepted"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface Booking {
  id: number;
  customerId: number;
  driverId?: number;
  companyId: number;
  pickup: string;
  dropoff: string;
  status: BookingStatus;
  fare?: number;
  requestedAt: string;
}
