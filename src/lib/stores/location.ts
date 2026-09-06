import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SelectedLocation = {
  cityId: string;
  cityName: string;
  zoneId: string;
  zoneName: string;
  label: string;
  line1: string;
  lat: number;
  lng: number;
  addressId?: string;
};

const DEFAULT_LOCATION: SelectedLocation = {
  cityId: "city_sribhumi",
  cityName: "Sribhumi",
  zoneId: "zone_bazaar",
  zoneName: "Central Bazaar",
  label: "Central Bazaar",
  line1: "Central Bazaar, Sribhumi",
  lat: 24.8688,
  lng: 92.3511,
};

type State = {
  location: SelectedLocation;
  setLocation: (location: SelectedLocation) => void;
};

export const useLocationStore = create<State>()(
  persist(
    (set) => ({
      location: DEFAULT_LOCATION,
      setLocation: (location) => set({ location }),
    }),
    { name: "marketplace-location" },
  ),
);

export { DEFAULT_LOCATION };
