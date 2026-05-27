"use client";

import { useState } from "react";
import Image from "next/image";
import { LogOut, ShoppingBag, User, MapPin, HelpCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";

const OrdersTab = dynamic(() => import("@/components/profile/OrdersTab"), { ssr: false });
const ProfileTab = dynamic(() => import("@/components/profile/ProfileTab"), { ssr: false });
const AddressesTab = dynamic(() => import("@/components/profile/AddressesTab"), { ssr: false });
const SupportTab = dynamic(() => import("@/components/profile/SupportTab"), { ssr: false });

type Tab = "orders" | "profile" | "addresses" | "support";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  { id: "addresses", label: "Addresses", icon: <MapPin className="w-4 h-4" /> },
  { id: "support", label: "Support", icon: <HelpCircle className="w-4 h-4" /> },
];

export function ProfileClient() {
  const { user, profile, loading, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("orders");
  const [showAuth, setShowAuth] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initials =
    profile?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fafb] pt-[72px]">
        {loading ? (
          <ProfileSkeleton />
        ) : !user ? (
          <NotSignedIn onSignIn={() => setShowAuth(true)} />
        ) : (
          <>
            {/* Profile header */}
            <div className="bg-white border-b border-slate-100">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {profile?.photoURL ? (
                      <Image
                        src={profile.photoURL}
                        alt={profile.displayName ?? "Profile"}
                        width={72}
                        height={72}
                        className="rounded-full ring-4 ring-[#f36b21]/20"
                      />
                    ) : (
                      <div className="w-[72px] h-[72px] rounded-full bg-[#1f2933] text-white flex items-center justify-center text-2xl font-bold">
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h1 className="font-heading text-xl font-bold text-[#1f2933] truncate">
                      {profile?.displayName ?? "User"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5 truncate">{profile?.email}</p>
                    {profile?.phone && (
                      <p className="text-sm text-slate-500">{profile.phone}</p>
                    )}
                    <span className="inline-flex mt-2 items-center gap-1 px-2 py-0.5 rounded-full bg-[#f36b21]/10 text-[10px] font-semibold text-[#f36b21] uppercase tracking-wide">
                      {profile?.role ?? "user"}
                    </span>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-500 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {loggingOut ? "Signing out…" : "Sign Out"}
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="flex gap-0 border-b border-slate-100 -mb-px">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                        tab === t.id
                          ? "border-[#f36b21] text-[#f36b21]"
                          : "border-transparent text-slate-500 hover:text-[#1f2933]"
                      }`}
                    >
                      {t.icon}
                      <span className="hidden sm:block">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
              {tab === "orders" && <OrdersTab uid={user.uid} />}
              {tab === "profile" && <ProfileTab uid={user.uid} />}
              {tab === "addresses" && <AddressesTab uid={user.uid} />}
              {tab === "support" && <SupportTab />}
            </div>
          </>
        )}
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

function ProfileSkeleton() {
  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-5">
          <div className="w-[72px] h-[72px] rounded-full skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 rounded skeleton" />
            <div className="h-4 w-56 rounded skeleton" />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex gap-4 pb-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-20 rounded skeleton" />
          ))}
        </div>
      </div>
    </div>
  );
}

function NotSignedIn({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#1f2933]/5 flex items-center justify-center mb-4">
        <User className="w-8 h-8 text-[#1f2933]/30" />
      </div>
      <h2 className="font-heading font-bold text-xl text-[#1f2933] mb-2">Sign in to view your profile</h2>
      <p className="text-sm text-slate-500 max-w-xs mb-6">
        Track orders, manage addresses, and save your preferences.
      </p>
      <button
        onClick={onSignIn}
        className="px-6 py-2.5 bg-[#1f2933] text-white text-sm font-semibold rounded-full hover:bg-[#323f4b] transition-colors"
      >
        Sign In / Sign Up
      </button>
    </div>
  );
}
