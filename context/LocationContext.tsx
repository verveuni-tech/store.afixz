"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type LocationId,
  DEFAULT_LOCATION,
  LOCATION_STORAGE_KEY,
} from "@/types/location";
import { useAuth } from "@/context/AuthContext";

interface LocationContextType {
  location: LocationId;
  setLocation: (id: LocationId) => void;
}

const LocationContext = createContext<LocationContextType>({
  location: DEFAULT_LOCATION,
  setLocation: () => {},
});

export function useLocation() {
  return useContext(LocationContext);
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [location, setLocationState] = useState<LocationId>(DEFAULT_LOCATION);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY) as LocationId | null;
    if (stored && ["delhi", "noida", "gurgaon"].includes(stored)) {
      setLocationState(stored);
    }
    setHydrated(true);
  }, []);

  // Sync from Firestore profile if available and nothing stored locally
  useEffect(() => {
    if (!hydrated) return;
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!stored && profile?.selectedLocation) {
      const loc = profile.selectedLocation as LocationId;
      if (["delhi", "noida", "gurgaon"].includes(loc)) {
        setLocationState(loc);
      }
    }
  }, [profile, hydrated]);

  const setLocation = useCallback(
    async (id: LocationId) => {
      setLocationState(id);
      localStorage.setItem(LOCATION_STORAGE_KEY, id);

      // Sync to Firestore if logged in
      if (user) {
        try {
          const { updateUserProfile } = await import("@/lib/firebase/user");
          // updateUserProfile only accepts displayName/phone/photoURL,
          // so we use updateDoc directly for selectedLocation
          const { getFirestore, doc, updateDoc } = await import("firebase/firestore");
          const { getFirebaseApp } = await import("@/lib/firebase/app");
          await updateDoc(doc(getFirestore(getFirebaseApp()), "users", user.uid), {
            selectedLocation: id,
          });
        } catch {
          // Non-critical — location already saved to localStorage
        }
      }
    },
    [user]
  );

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
