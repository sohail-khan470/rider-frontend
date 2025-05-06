// src/stores/booking.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { bookingApi } from "../api/endpoints/booking.api";
import { Booking, BookingStatus } from "./types/booking.types";

type BookingState = {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
};

type CreateBookingData = {
  pickup: string;
  dropoff: string;
  fare?: number;
};

type BookingActions = {
  createBooking: (bookingData: CreateBookingData) => Promise<void>;
  fetchCustomerBookings: () => Promise<void>;
  fetchCompanyBookings: () => Promise<void>;
  fetchDriverBookings: () => Promise<void>;
  cancelBooking: (bookingId: number) => Promise<void>;
  assignDriver: (bookingId: number, driverId: number) => Promise<void>;
  updateBookingStatus: (
    bookingId: number,
    status: BookingStatus
  ) => Promise<void>;
  acceptBooking: (bookingId: number) => Promise<void>;
  completeBooking: (bookingId: number) => Promise<void>;
  clearError: () => void;
  setCurrentBooking: (booking: Booking | null) => void;
};

export const useBookingStore = create<BookingState & BookingActions>()(
  immer((set) => ({
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,

    createBooking: async (bookingData: CreateBookingData) => {
      set({ loading: true, error: null });
      try {
        const booking = await bookingApi.createBooking(bookingData);
        set((state) => {
          state.bookings.unshift(booking);
          state.loading = false;
        });
      } catch (error: unknown) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to create booking",
          loading: false,
        });
      }
    },

    fetchCustomerBookings: async () => {
      set({ loading: true, error: null });
      try {
        const bookings = await bookingApi.getCustomerBookings();
        set({ bookings, loading: false });
      } catch (error: unknown) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch customer bookings",
          loading: false,
        });
      }
    },

    fetchCompanyBookings: async () => {
      set({ loading: true, error: null });
      try {
        const bookings = await bookingApi.getCompanyBookings();
        set({ bookings, loading: false });
      } catch (error: unknown) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch company bookings",
          loading: false,
        });
      }
    },

    fetchDriverBookings: async () => {
      set({ loading: true, error: null });
      try {
        const bookings = await bookingApi.getDriverBookings();
        set({ bookings, loading: false });
      } catch (error: unknown) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch driver bookings",
          loading: false,
        });
      }
    },

    cancelBooking: async (bookingId: number) => {
      set({ loading: true, error: null });
      try {
        const booking = await bookingApi.cancelBooking(bookingId);
        set((state) => {
          const index = state.bookings.findIndex(
            (b: Booking) => b.id === bookingId
          );
          if (index !== -1) {
            state.bookings[index] = booking;
          }
          state.loading = false;
        });
      } catch (error: unknown) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to cancel booking",
          loading: false,
        });
      }
    },

    assignDriver: async (bookingId: number, driverId: number) => {
      set({ loading: true, error: null });
      try {
        const booking = await bookingApi.assignDriver(bookingId, driverId);
        set((state) => {
          const index = state.bookings.findIndex(
            (b: Booking) => b.id === bookingId
          );
          if (index !== -1) {
            state.bookings[index] = booking;
          }
          state.loading = false;
        });
      } catch (error: unknown) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to assign driver",
          loading: false,
        });
      }
    },

    updateBookingStatus: async (bookingId: number, status: BookingStatus) => {
      set({ loading: true, error: null });
      try {
        const booking = await bookingApi.updateBookingStatus(bookingId, status);
        set((state) => {
          const index = state.bookings.findIndex(
            (b: Booking) => b.id === bookingId
          );
          if (index !== -1) {
            state.bookings[index] = booking;
          }
          state.loading = false;
        });
      } catch (error: unknown) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to update booking status",
          loading: false,
        });
      }
    },

    acceptBooking: async (bookingId: number) => {
      set({ loading: true, error: null });
      try {
        const booking = await bookingApi.acceptBooking(bookingId);
        set((state) => {
          const index = state.bookings.findIndex(
            (b: Booking) => b.id === bookingId
          );
          if (index !== -1) {
            state.bookings[index] = booking;
          }
          state.loading = false;
        });
      } catch (error: unknown) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to accept booking",
          loading: false,
        });
      }
    },

    completeBooking: async (bookingId: number) => {
      set({ loading: true, error: null });
      try {
        const booking = await bookingApi.completeBooking(bookingId);
        set((state) => {
          const index = state.bookings.findIndex(
            (b: Booking) => b.id === bookingId
          );
          if (index !== -1) {
            state.bookings[index] = booking;
          }
          state.loading = false;
        });
      } catch (error: unknown) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to complete booking",
          loading: false,
        });
      }
    },

    clearError: () => {
      set({ error: null });
    },

    setCurrentBooking: (booking: Booking | null) => {
      set({ currentBooking: booking });
    },
  }))
);
