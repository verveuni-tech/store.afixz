import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  phone: string | null;
  photoURL: string | null;
  provider: "google.com" | "email" | "phone" | null;
  role: "user" | "admin" | "provider";
  selectedLocation?: string | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type SavedAddress = {
  id: string;

  fullName: string;
  phone: string;

  line1: string;
  line2?: string;

  city: string;
  state?: string;

  pincode: string;

  landmark?: string;

  label?: string;

  fullAddress?: string;

  isDefault?: boolean;

  createdAt?: any;
};
