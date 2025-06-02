export type Location = {
  id: number;
  driverId?: number;
  lat: number;
  lng: number;
  address?: string;
  updatedAt: string;
};

export type SearchedLocation = {
  lat: number;
  lng: number;
  address: string;
  display_name?: string;
};
