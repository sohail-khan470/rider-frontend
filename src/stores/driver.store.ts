// src/stores/driver.store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { driverApi } from "../api/endpoints/driver.api";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

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

type DriverState = {
  drivers: Driver[];
  currentDriver: Driver | null;
  loading: boolean;
  error: string | null;
};

type DriverActions = {
  createDriver: (driverData: CreateDriverData) => Promise<void>;
  fetchDrivers: () => Promise<void>;
  fetchDriverById: (id: number) => Promise<void>;
  updateDriver: (id: number, data: UpdateDriverData) => Promise<void>;
  deleteDriver: (id: number) => Promise<void>;
  updateDriverStatus: (id: number, status: DriverStatus) => Promise<void>;
  updateDriverLocation: (id: number, location: LocationData) => Promise<void>;
  addDriverAvailability: (data: AvailabilityData) => Promise<void>;
  removeDriverAvailability: (id: number) => Promise<void>;
  clearError: () => void;
  setCurrentDriver: (driver: Driver | null) => void;
};

export const useDriverStore = create<DriverState & DriverActions>()(
  immer((set) => ({
    drivers: [],
    currentDriver: null,
    loading: false,
    error: null,

    createDriver: async (driverData: CreateDriverData) => {
      set({ loading: true, error: null });
      try {
        const driver = await driverApi.createDriver(driverData);
        set((state) => {
          state.drivers.unshift(driver);
          state.loading = false;
        });
        toast.success("Driver created successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create driver";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    fetchDrivers: async () => {
      set({ loading: true, error: null });

      const token = localStorage.getItem("authToken") || "";
      const decoded = jwtDecode(token) as any;
      const companyId = decoded.companyId;

      try {
        const response = await driverApi.getDrivers(companyId);
        set({ drivers: response.drivers, loading: false });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch drivers";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    fetchDriverById: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const driver = await driverApi.getDriverById(id);
        set({ currentDriver: driver, loading: false });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch driver";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    updateDriver: async (id: number, data: UpdateDriverData) => {
      set({ loading: true, error: null });
      try {
        const driver = await driverApi.updateDriver(id, data);
        set((state) => {
          const index = state.drivers.findIndex((d) => d.id === id);
          if (index !== -1) {
            state.drivers[index] = driver;
          }
          if (state.currentDriver?.id === id) {
            state.currentDriver = driver;
          }
          state.loading = false;
        });
        toast.success("Driver updated successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update driver";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    deleteDriver: async (id: number) => {
      set({ loading: true, error: null });
      try {
        await driverApi.deleteDriver(id);
        set((state) => {
          state.drivers = state.drivers.filter((d) => d.id !== id);
          if (state.currentDriver?.id === id) {
            state.currentDriver = null;
          }
          state.loading = false;
        });
        toast.success("Driver deleted successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete driver";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    //   set({ loading: true, error: null });
    //   try {
    //     const driver = await driverApi.updateDriverStatus(id, status);
    //     set((state) => {
    //       const index = state.drivers.findIndex((d) => d.id === id);
    //       if (index !== -1) {
    //         state.drivers[index] = driver;
    //       }
    //       if (state.currentDriver?.id === id) {
    //         state.currentDriver = driver;
    //       }
    //       state.loading = false;
    //     });
    //     toast.success(`Driver status updated to ${status}`);
    //   } catch (error: unknown) {
    //     const errorMessage =
    //       error instanceof Error
    //         ? error.message
    //         : "Failed to update driver status";
    //     set({
    //       error: errorMessage,
    //       loading: false,
    //     });
    //     toast.error(errorMessage);
    //   }
    // },

    // updateDriverStatus: async (id: number, status: DriverStatus) => {
    //   console.log("@update drive is called");
    //   set({ loading: true, error: null });
    //   try {
    //     const driver = await driverApi.updateDriverStatus(id, status);
    //     set((state) => ({
    //       drivers: state.drivers.map((d) => (d.id === id ? driver : d)),
    //       currentDriver:
    //         state.currentDriver?.id === id ? driver : state.currentDriver,
    //       loading: false,
    //     }));
    //     toast.success(`Driver status updated to ${status}`);
    //   } catch (error: unknown) {
    //     const errorMessage =
    //       error instanceof Error
    //         ? error.message
    //         : "Failed to update driver status";
    //     set({
    //       error: errorMessage,
    //       loading: false,
    //     });
    //     toast.error(errorMessage);
    //   }
    // },

    updateDriverStatus: async (id: number, status: DriverStatus) => {
      console.log("@update drive is called");
      set((state) => ({
        loading: true,
        error: null,
        // Optimistic update
        drivers: state.drivers.map((d) => (d.id === id ? { ...d, status } : d)),
        currentDriver:
          state.currentDriver?.id === id
            ? { ...state.currentDriver, status }
            : state.currentDriver,
      }));

      try {
        const driver = await driverApi.updateDriverStatus(id, status);
        // Final update with confirmed data
        set((state) => ({
          drivers: state.drivers.map((d) => (d.id === id ? driver : d)),
          currentDriver:
            state.currentDriver?.id === id ? driver : state.currentDriver,
          loading: false,
        }));
        toast.success(`Driver status updated to ${status}`);
      } catch (error: unknown) {
        // Rollback on error
        set((state) => ({
          drivers: state.drivers.map((d) =>
            d.id === id
              ? { ...d, status: state.currentDriver?.status || d.status }
              : d
          ),
          error:
            error instanceof Error
              ? error.message
              : "Failed to update driver status",
          loading: false,
        }));
        toast.error("Failed to update driver status");
      }
    },
    updateDriverLocation: async (id: number, location: LocationData) => {
      set({ loading: true, error: null });
      try {
        const updatedLocation = await driverApi.updateDriverLocation(
          id,
          location
        );
        set((state) => {
          const index = state.drivers.findIndex((d) => d.id === id);
          if (index !== -1) {
            state.drivers[index].location = updatedLocation;
          }
          if (state.currentDriver?.id === id) {
            state.currentDriver.location = updatedLocation;
          }
          state.loading = false;
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update driver location";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    addDriverAvailability: async (data: AvailabilityData) => {
      set({ loading: true, error: null });
      try {
        const availability = await driverApi.addDriverAvailability(data);
        set((state) => {
          if (state.currentDriver?.id === data.driverId) {
            if (!state.currentDriver.availability) {
              state.currentDriver.availability = [];
            }
            state.currentDriver.availability.push(availability);
          }
          state.loading = false;
        });
        toast.success("Availability added successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to add availability";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    removeDriverAvailability: async (id: number) => {
      set({ loading: true, error: null });
      try {
        await driverApi.removeDriverAvailability(id);
        set((state) => {
          if (state.currentDriver?.availability) {
            state.currentDriver.availability =
              state.currentDriver.availability.filter((a) => a.id !== id);
          }
          state.loading = false;
        });
        toast.success("Availability removed successfully");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to remove availability";
        set({
          error: errorMessage,
          loading: false,
        });
        toast.error(errorMessage);
      }
    },

    clearError: () => {
      set({ error: null });
    },

    setCurrentDriver: (driver: Driver | null) => {
      set({ currentDriver: driver });
    },
  }))
);
