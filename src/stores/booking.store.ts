// src/stores/booking.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { bookingApi } from "../api/endpoints/booking.api";
import { Booking, BookingStatus } from "./types/booking.types";
import { jwtDecode } from "jwt-decode";
// Import your toast library
import { toast } from "react-toastify"; // or your preferred toast library

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
  acceptBooking: (bookingId: number, status: BookingStatus) => Promise<void>;
  completeBooking: (bookingId: number, status: BookingStatus) => Promise<void>;
  clearError: () => void;
  setCurrentBooking: (booking: Booking | null) => void;
  startBooking: (bookingId: number, status: BookingStatus) => Promise<void>;
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
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create booking";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    fetchCustomerBookings: async () => {
      set({ loading: true, error: null });
      try {
        const bookings = await bookingApi.getCustomerBookings();

        set({ bookings, loading: false });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch customer bookings";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    fetchCompanyBookings: async () => {
      console.log("@Company bookings");
      set({ loading: true, error: null });

      const token = localStorage.getItem("authToken") || "";
      const decoded = jwtDecode(token) as any;
      const companyId = decoded.companyId;

      try {
        const response = (await bookingApi.getCompanyBookings(
          companyId
        )) as any;

        set({ bookings: response.result, loading: false });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch company bookings";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    fetchDriverBookings: async () => {
      set({ loading: true, error: null });
      try {
        const bookings = await bookingApi.getDriverBookings();
        set({ bookings, loading: false });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch driver bookings";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    cancelBooking: async (bookingId: number) => {
      set({ loading: true, error: null });
      try {
        const booking = (await bookingApi.cancelBooking(bookingId)) as any;
        const updatedBooking = booking.result.updatedBooking;
        set((state) => {
          const index = state.bookings.findIndex(
            (b: Booking) => b.id === bookingId
          );
          if (index !== -1) {
            state.bookings[index] = updatedBooking;
          }
          state.loading = false;
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to cancel booking";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    assignDriver: async (bookingId: number, driverId: number) => {
      console.log("@ASSIGN DRIVER");
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
      } catch (error: any) {
        const message = error.response.data.message;
        const errorMessage =
          error instanceof Error ? error.message : "Failed to assign driver";
        set({
          error: message,
          loading: false,
        });
        toast.error(message);
      }
    },

    updateBookingStatus: async (bookingId: number, status: BookingStatus) => {
      console.log("@Update Booking status");
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
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update booking status";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    acceptBooking: async (bookingId: number, status: BookingStatus) => {
      try {
        const response = (await bookingApi.acceptBooking(
          bookingId,
          status
        )) as any;

        set((state) => {
          const index = state.bookings.findIndex((b) => b.id === bookingId);
          if (index !== -1) {
            state.bookings[index] = response.booking; // Final update
          }
          state.loading = false;
        });
      } catch (error) {
        // Revert on error
        set((state) => {
          const index = state.bookings.findIndex((b) => b.id === bookingId);
          if (index !== -1) {
            state.bookings[index].status = "pending"; // Revert status
          }
          state.loading = false;
          state.error =
            error instanceof Error ? error.message : "Failed to accept booking";
        });
        toast.error("Failed to accept booking");
      }
    },

    completeBooking: async (bookingId: number, status: BookingStatus) => {
      set({ loading: true, error: null });
      try {
        const booking = (await bookingApi.completeBooking(
          bookingId,
          status
        )) as any;
        console.log(booking, "CCCCCCCCCC");
        set((state) => {
          const index = state.bookings.findIndex(
            (b: Booking) => b.id === bookingId
          );
          if (index !== -1) {
            state.bookings[index] = booking.data;
          }
          state.loading = false;
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to complete booking";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    startBooking: async (bookingId: number, status: BookingStatus) => {
      set({ loading: true, error: null }); // <-- Set loading true initially
      try {
        const response = (await bookingApi.startBooking(
          bookingId,
          status
        )) as any;
        set((state) => {
          const index = state.bookings.findIndex(
            (b: Booking) => b.id === bookingId
          );
          if (index !== -1) {
            state.bookings[index] = response.booking;
          }
          state.loading = false; // <-- Set loading false after update
        });
        toast.success("Booking started successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to start booking";
        set({
          error: errorMessage,
          loading: false, // <-- Ensure loading is reset on error
        });
        toast.error(errorMessage);
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
