"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Menu, X, Leaf, LogIn, MapPin, ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { LOCATIONS } from "@/types/location";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const { user, profile, loading } = useAuth();
  const { count } = useCart();
  const { location, setLocation } = useLocation();

  const currentLocation = LOCATIONS.find((l) => l.id === location) ?? LOCATIONS[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials =
    profile?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/[0.06]"
            : "bg-white border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-[#1f2933] flex items-center justify-center group-hover:bg-[#323f4b] transition-colors">
              <Leaf className="w-4 h-4 text-[#f36b21]" />
            </div>
            <div className="leading-none">
              <span className="font-heading text-[15px] font-bold text-[#1f2933] tracking-tight">
                afixz
              </span>
              <span
                className="block text-[9px] uppercase tracking-[0.18em] text-[#f36b21] font-medium"
                style={{ fontFamily: "var(--font-condensed)" }}
              >
                store
              </span>
            </div>
          </Link>

          {/* Location picker */}
          <div ref={locationRef} className="relative hidden sm:block flex-shrink-0">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[#f36b21]" />
              <span className="font-medium text-[#1f2933] text-[13px]">{currentLocation.short}</span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${locationOpen ? "rotate-180" : ""}`}
              />
            </button>

            {locationOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 overflow-hidden z-50">
                <p
                  className="px-3.5 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-condensed)" }}
                >
                  Deliver to
                </p>
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setLocation(loc.id);
                      setLocationOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-50 transition-colors ${
                      loc.id === location ? "text-[#f36b21]" : "text-[#1f2933]"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium">{loc.label}</p>
                      <p className="text-[11px] text-slate-400">{loc.area}</p>
                    </div>
                    {loc.id === location && <Check className="w-3.5 h-3.5 text-[#f36b21]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search — desktop */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search plants, compost, pots…"
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f36b21]/30 focus:border-[#f36b21]/50 transition-all"
              />
            </div>
          </div>

          {/* Nav links — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Plants", href: "/shop/plants" },
              { label: "Compost", href: "/shop/compost" },
              { label: "Pots", href: "/shop/pots" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm font-medium text-[#1f2933]/70 hover:text-[#1f2933] hover:bg-slate-100 rounded-lg transition-all"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="https://afixz.com"
              target="_blank"
              className="px-3 py-1.5 text-sm font-medium text-[#f36b21] hover:bg-[#f36b21]/10 rounded-lg transition-all"
            >
              Services ↗
            </Link>
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <Search className="w-4 h-4" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#f36b21] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            {/* Auth */}
            {loading ? (
              <div className="w-9 h-9 rounded-full skeleton" />
            ) : user ? (
              <Link href="/profile" aria-label="Profile">
                {profile?.photoURL ? (
                  <Image
                    src={profile.photoURL}
                    alt={profile.displayName ?? "Profile"}
                    width={36}
                    height={36}
                    className="rounded-full ring-2 ring-[#f36b21]/20 hover:ring-[#f36b21]/50 transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#1f2933] text-white flex items-center justify-center text-xs font-bold hover:bg-[#323f4b] transition-colors">
                    {initials}
                  </div>
                )}
              </Link>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#1f2933] border border-slate-200 hover:border-[#1f2933]/30 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg">
            <div className="px-4 py-4 flex flex-col gap-1">
              {/* Mobile location picker */}
              <div className="mb-3 flex gap-1.5">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setLocation(loc.id)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      loc.id === location
                        ? "border-[#f36b21] bg-[#f36b21]/5 text-[#f36b21]"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>

              <div className="mb-3 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f36b21]/30"
                />
              </div>
              {[
                { label: "Plants", href: "/shop/plants" },
                { label: "Compost & Khad", href: "/shop/compost" },
                { label: "Pots & Planters", href: "/shop/pots" },
                ...(user
                  ? [
                      { label: "My Orders", href: "/profile?tab=orders" },
                      { label: "My Profile", href: "/profile" },
                    ]
                  : []),
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2.5 text-sm font-medium text-[#1f2933] hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => { setMobileOpen(false); setShowAuth(true); }}
                  className="mt-1 px-3 py-2.5 text-sm font-semibold text-[#f36b21] hover:bg-[#f36b21]/5 rounded-lg text-left transition-colors"
                >
                  Sign In / Sign Up
                </button>
              )}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <Link
                  href="https://afixz.com"
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#f36b21] hover:bg-[#f36b21]/5 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <Leaf className="w-4 h-4" />
                  Book Garden Services on AfixZ ↗
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
