// src/api/types/booking.types.ts
export type BookingStatus =
  | "pending"
  | "accepted"
  | "ongoing"
  | "completed"
  | "cancelled";

// export interface Booking {
//   id: number;
//   customerId: number;
//   driverId?: number;
//   companyId: number;
//   pickup: string;
//   dropoff: string;
//   status: BookingStatus;
//   fare?: number;
//   requestedAt: string;
// }
export type Booking = {
  id: number;
  companyId: number;
  customer: {
    id: number;
    name: string;
    phone: string;
  };
  driver?: {
    id: number;
    name: string;
    vehicleInfo: string;
  };
  pickup: string;
  dropoff: string;
  fare: number | null;
  status: BookingStatus;
  requestedAt: string;
};
