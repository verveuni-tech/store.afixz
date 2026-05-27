"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import type { UserProfile } from "@/types/user";
import { getUserProfile, ensureUserProfile } from "@/lib/firebase/user";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (u: User) => {
    try {
      const p = await ensureUserProfile(u.uid, {
        displayName: u.displayName ?? undefined,
        email: u.email ?? undefined,
        photoURL: u.photoURL ?? undefined,
        provider: (u.providerData[0]?.providerId as UserProfile["provider"]) ?? null,
      });
      setProfile(p);
    } catch {
      const p = await getUserProfile(u.uid);
      setProfile(p);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await getUserProfile(user.uid);
    setProfile(p);
  }, [user]);

  useEffect(() => {
    // Dynamically import to avoid SSR issues
    let unsubscribe: (() => void) | null = null;

    (async () => {
      const { getAuth, onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } =
        await import("firebase/auth");
      const { getFirebaseApp } = await import("@/lib/firebase/app");

      const auth = getAuth(getFirebaseApp());

      // Handle email magic link callback
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = localStorage.getItem("afixz_store_email_for_signin");
        if (!email) {
          email = window.prompt("Please enter your email to complete sign-in") ?? "";
        }
        if (email) {
          try {
            await signInWithEmailLink(auth, email, window.location.href);
            localStorage.removeItem("afixz_store_email_for_signin");
            // Clean URL
            window.history.replaceState({}, "", window.location.pathname);
          } catch {
            // Sign-in failed, continue as unauthenticated
          }
        }
      }

      unsubscribe = onAuthStateChanged(auth, async (u) => {
        setUser(u);
        if (u) {
          await loadProfile(u);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
    })();

    return () => {
      unsubscribe?.();
    };
  }, [loadProfile]);

  const logout = useCallback(async () => {
    const { getAuth, signOut } = await import("firebase/auth");
    const { getFirebaseApp } = await import("@/lib/firebase/app");
    await signOut(getAuth(getFirebaseApp()));
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
