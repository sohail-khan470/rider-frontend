// src/stores/schedule.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { scheduleApi } from "../api/endpoints/schedule.api";

export type ScheduleStatus =
  | "scheduled"
  | "in_progress"
  | "arrived"
  | "returning"
  | "completed"
  | "cancelled";

export type Schedule = {
  id: number;
  companyId: number;
  driverId: number;
  fromCityId: number;
  toCityId: number;
  departure: string;
  estimatedArrival: string;
  returnTime?: string;
  status: ScheduleStatus;
  driver: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  fromCity: {
    id: number;
    name: string;
  };
  toCity: {
    id: number;
    name: string;
  };
  returnBookings?: any[];
  createdAt: string;
  updatedAt: string;
};

export type CreateScheduleData = {
  driverId: number;
  fromCityId: number;
  toCityId: number;
  departure: string;
  estimatedArrival: string;
  returnTime?: string;
};

type ScheduleState = {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  loading: boolean;
  error: string | null;
};

type ScheduleActions = {
  createSchedule: (scheduleData: CreateScheduleData) => Promise<void>;
  fetchCompanySchedules: () => Promise<void>;
  updateSchedule: (
    id: number,
    data: Partial<CreateScheduleData>
  ) => Promise<void>;
  cancelSchedule: (id: number) => Promise<void>;
  startTrip: (id: number) => Promise<void>;
  markArrived: (id: number) => Promise<void>;
  startReturn: (id: number) => Promise<void>;
  completeSchedule: (id: number) => Promise<void>;
  getAvailableReturnSchedules: (
    cityId: number,
    destinationCityId: number
  ) => Promise<Schedule[]>;
  setCurrentSchedule: (schedule: Schedule | null) => void;
  clearError: () => void;
};

export const useScheduleStore = create<ScheduleState & ScheduleActions>()(
  immer((set) => ({
    schedules: [],
    currentSchedule: null,
    loading: false,
    error: null,

    createSchedule: async (scheduleData: CreateScheduleData) => {
      set({ loading: true, error: null });
      try {
        let schedule = (await scheduleApi.createSchedule(scheduleData)) as any;
        const newSchedule = schedule.data;
        set((state) => {
          state.schedules.unshift(newSchedule);
          state.loading = false;
        });
        toast.success("Schedule created successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create schedule";
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },

    fetchCompanySchedules: async () => {
      set({ loading: true, error: null });
      try {
        const token = localStorage.getItem("authToken") || "";
        const decoded = jwtDecode(token) as any;
        const companyId = decoded.companyId;

        const schedules = (await scheduleApi.getCompanySchedules(
          companyId
        )) as any;
        set({ schedules: schedules.data, loading: false });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch schedules";
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },

    updateSchedule: async (id: number, data: Partial<CreateScheduleData>) => {
      set({ loading: true, error: null });
      try {
        const updatedSchedule = (await scheduleApi.updateSchedule(
          id,
          data
        )) as any;
        set((state) => {
          const index = state.schedules.findIndex((s) => s.id === id);
          if (index !== -1) {
            state.schedules[index] = updatedSchedule.data;
          }
          state.loading = false;
        });
        toast.success("Schedule updated successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update schedule";
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },

    cancelSchedule: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const updatedSchedule = (await scheduleApi.cancelSchedule(id)) as any;
        console.log(updatedSchedule);
        set((state) => {
          const index = state.schedules.findIndex((s) => s.id === id);
          if (index !== -1) {
            state.schedules[index] = updatedSchedule.data;
          }
          state.loading = false;
        });
        toast.success("Schedule cancelled successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to cancel schedule";
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },

    startTrip: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const updatedSchedule = (await scheduleApi.startTrip(id)) as any;
        console.log(updatedSchedule);
        set((state) => {
          const index = state.schedules.findIndex((s) => s.id === id);
          if (index !== -1) {
            state.schedules[index] = updatedSchedule.data;
          }
          state.loading = false;
        });
        toast.success("Trip started successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to start trip";
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },

    markArrived: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const updatedSchedule = await scheduleApi.markArrived(id);
        set((state) => {
          const index = state.schedules.findIndex((s) => s.id === id);
          if (index !== -1) {
            state.schedules[index] = updatedSchedule;
          }
          state.loading = false;
        });
        toast.success("Arrival marked successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to mark arrival";
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },

    startReturn: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const updatedSchedule = await scheduleApi.startReturn(id);
        set((state) => {
          const index = state.schedules.findIndex((s) => s.id === id);
          if (index !== -1) {
            state.schedules[index] = updatedSchedule;
          }
          state.loading = false;
        });
        toast.success("Return trip started successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to start return";
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },

    completeSchedule: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const updatedSchedule = await scheduleApi.completeSchedule(id);
        set((state) => {
          const index = state.schedules.findIndex((s) => s.id === id);
          if (index !== -1) {
            state.schedules[index] = updatedSchedule;
          }
          state.loading = false;
        });
        toast.success("Schedule completed successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to complete schedule";
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },

    getAvailableReturnSchedules: async (
      cityId: number,
      destinationCityId: number
    ) => {
      try {
        const schedules = await scheduleApi.getAvailableReturnSchedules(
          cityId,
          destinationCityId
        );
        return schedules;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch return schedules";
        toast.error(errorMessage);
        return [];
      }
    },

    setCurrentSchedule: (schedule: Schedule | null) => {
      set({ currentSchedule: schedule });
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);
