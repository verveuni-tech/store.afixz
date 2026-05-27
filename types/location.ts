export type LocationId = "delhi" | "noida" | "gurgaon";

export interface LocationOption {
  id: LocationId;
  label: string;
  short: string;
  area: string;
}

export const LOCATIONS: LocationOption[] = [
  { id: "noida", label: "Noida", short: "Noida", area: "Uttar Pradesh" },
  { id: "delhi", label: "Delhi", short: "Delhi", area: "Delhi NCR" },
  { id: "gurgaon", label: "Gurgaon", short: "Gurgaon", area: "Haryana" },
];

export const DEFAULT_LOCATION: LocationId = "noida";
export const LOCATION_STORAGE_KEY = "afixz:selected-location";
