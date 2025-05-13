// src/api/endpoints/booking.api.ts
import apiClient from "../client";
import { Booking, BookingStatus } from "../types/booking.types";

export const bookingApi = {
  // Customer endpoints
  createBooking: async (bookingData: {
    pickup: string;
    dropoff: string;
    fare?: number;
  }): Promise<Booking> => {
    const response = await apiClient.post("/customers/bookings", bookingData);
    return response.data;
  },

  getCustomerBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get("/customers/bookings");
    return response.data;
  },

  cancelBooking: async (bookingId: number): Promise<Booking> => {
    const response = await apiClient.patch(
      `/customers/bookings/${bookingId}/cancel`
    );
    return response.data;
  },

  // Company endpoints
  getCompanyBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.post("/api/bookings/company", {
      companyId: 2,
    });
    return response.data;
  },

  assignDriver: async (
    bookingId: number,
    driverId: number
  ): Promise<Booking> => {
    const response = await apiClient.patch(
      `/companies/bookings/${bookingId}/assign`,
      { driverId }
    );
    return response.data;
  },

  updateBookingStatus: async (
    bookingId: number,
    status: BookingStatus
  ): Promise<Booking> => {
    const response = await apiClient.patch(
      `/companies/bookings/${bookingId}/status`,
      { status }
    );
    return response.data;
  },

  // Driver endpoints
  getDriverBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get("/drivers/bookings");
    return response.data;
  },

  acceptBooking: async (bookingId: number): Promise<Booking> => {
    const response = await apiClient.patch(
      `/drivers/bookings/${bookingId}/accept`
    );
    return response.data;
  },

  completeBooking: async (bookingId: number): Promise<Booking> => {
    const response = await apiClient.patch(
      `/drivers/bookings/${bookingId}/complete`
    );
    return response.data;
  },
};
