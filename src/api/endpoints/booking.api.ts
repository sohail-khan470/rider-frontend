// api/endpoints/booking.api.ts

import { Booking, BookingStatus } from "../types/booking.types";
import apiClient from "../client";

export const bookingApi = {
  createBooking: async (bookingData: {
    pickup: string;
    dropoff: string;
    fare?: number;
  }): Promise<Booking> => {
    const response = await apiClient.post("/api/bookings", bookingData);
    return response.data;
  },

  getCustomerBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get("/api/bookings/customer");
    return response.data;
  },

  getCompanyBookings: async (companyId: number): Promise<Booking[]> => {
    const response = await apiClient.post("/api/bookings/company", {
      companyId,
    });
    return response.data;
  },

  getDriverBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get("/api/bookings/driver");
    return response.data;
  },

  cancelBooking: async (bookingId: number): Promise<Booking> => {
    const response = await apiClient.patch(`/api/bookings/${bookingId}/cancel`);
    return response.data;
  },

  assignDriver: async (
    bookingId: number,
    driverId: number
  ): Promise<Booking> => {
    const response = await apiClient.patch(
      `/api/bookings/${bookingId}/assign`,
      {
        driverId,
      }
    );
    return response.data;
  },

  updateBookingStatus: async (
    bookingId: number,
    status: BookingStatus
  ): Promise<Booking> => {
    const response = await apiClient.patch(
      `/api/bookings/${bookingId}/status`,
      {
        status,
      }
    );
    return response.data;
  },

  acceptBooking: async (bookingId: number): Promise<Booking> => {
    const response = await apiClient.patch(`/api/bookings/${bookingId}/accept`);
    return response.data;
  },

  completeBooking: async (bookingId: number): Promise<Booking> => {
    const response = await apiClient.patch(
      `/api/bookings/${bookingId}/complete`
    );
    return response.data;
  },

  getBookingById: async (bookingId: number): Promise<Booking> => {
    const response = await apiClient.get(`/api/bookings/${bookingId}`);
    return response.data;
  },
};
