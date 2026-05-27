"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package, MapPin, ChevronDown, ChevronUp, Check,
  Leaf, ShoppingBag, LogIn, AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { getAddresses } from "@/lib/firebase/user";
import { createProductOrder } from "@/lib/firebase/orders";
import { LOCATIONS } from "@/types/location";
import type { SavedAddress } from "@/types/user";

const SHIPPING_THRESHOLD = 499;
const SHIPPING_COST = 49;

interface AddressForm {
  name: string;
  phone: string;
  houseNo: string;
  area: string;
  landmark: string;
  city: string;
  pincode: string;
}

const EMPTY_FORM: AddressForm = {
  name: "", phone: "", houseNo: "", area: "", landmark: "", city: "", pincode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { location } = useLocation();

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedSaved, setSelectedSaved] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;
  const currentCity = LOCATIONS.find((l) => l.id === location)?.label ?? location;

  // Pre-fill name/phone from profile
  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || profile.displayName || "",
        phone: prev.phone || profile.phone || "",
      }));
    }
  }, [profile]);

  // Load saved addresses
  useEffect(() => {
    if (user) {
      getAddresses(user.uid).then((addrs) => {
        setSavedAddresses(addrs);
        const def = addrs.find((a) => a.isDefault) ?? addrs[0];
        if (def) {
          setSelectedSaved(def.id);
          setShowNewForm(false);
        } else {
          setShowNewForm(true);
        }
      });
    } else {
      setShowNewForm(true);
    }
  }, [user]);

  function updateForm(key: keyof AddressForm, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function getDeliveryAddress() {
    if (selectedSaved && !showNewForm) {
      const addr = savedAddresses.find((a) => a.id === selectedSaved);
      if (addr) return addr;
    }
    return null;
  }

  function buildAddressFromForm() {
    const full = [form.houseNo, form.area, form.landmark, form.city, form.pincode]
      .filter(Boolean)
      .join(", ");
    return {
      name: form.name.trim(),
      phone: form.phone.trim(),
      houseNo: form.houseNo.trim(),
      area: form.area.trim(),
      landmark: form.landmark.trim() || undefined,
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      fullAddress: full,
    };
  }

  function isFormValid() {
    if (showNewForm || !selectedSaved) {
      return (
        form.name.trim() &&
        form.phone.trim().length >= 10 &&
        form.houseNo.trim() &&
        form.area.trim() &&
        form.city.trim() &&
        form.pincode.trim().length === 6
      );
    }
    return !!selectedSaved;
  }

  async function handlePlaceOrder() {
    if (!user) { setShowAuth(true); return; }
    if (!isFormValid() || placing || count === 0) return;

    setPlacing(true);
    try {
      const saved = getDeliveryAddress();
      const address = saved
        ? {
          name: saved.fullName,
          phone: saved.phone,
          houseNo: saved.line1,
          area: saved.fullAddress ?? "",
          landmark: saved.landmark ?? "",
          city: saved.city,
          pincode: saved.pincode,
          fullAddress: saved.fullAddress ?? "",
        }
        : buildAddressFromForm();

      const id = await createProductOrder({
        userId: user.uid,
        items,
        subtotal: total,
        shippingCost: shipping,
        total: grandTotal,
        shippingAddress: address,
        locationId: location,
        notes: notes.trim(),
      });

      clearCart();
      setOrderId(id);
    } catch (err) {
      console.error("Order failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  // ── Order success state ──
  if (orderId) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f9fafb] pt-[72px] flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <Check className="w-10 h-10 text-emerald-500" />
            </div>
            <h2
              className="text-2xl font-bold text-[#1f2933] mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Order Placed!
            </h2>
            <p className="text-slate-500 text-sm mb-1">
              Your order has been confirmed. We'll deliver to{" "}
              <span className="font-medium text-[#1f2933]">{currentCity}</span>.
            </p>
            <p className="text-xs text-slate-400 mb-2">
              Order ID:{" "}
              <span className="font-mono font-semibold text-[#1f2933]">
                #{orderId.slice(-8).toUpperCase()}
              </span>
            </p>
            <div className="bg-[#f36b21]/5 border border-[#f36b21]/20 rounded-xl px-4 py-3 mb-7">
              <div className="flex items-center gap-2 justify-center text-sm text-[#f36b21] font-medium">
                <Leaf className="w-4 h-4" />
                Cash on Delivery — pay when it arrives
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1f2933] text-white text-sm font-semibold rounded-full hover:bg-[#323f4b] transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Track Order
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 border border-slate-200 text-sm font-semibold text-[#1f2933] rounded-full hover:border-slate-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Empty cart guard ──
  if (count === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f9fafb] pt-[72px] flex items-center justify-center px-4">
          <div className="text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl text-[#1f2933] mb-2">Your cart is empty</h2>
            <Link href="/" className="text-sm text-[#f36b21] hover:underline">← Back to shopping</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fafb] pt-[72px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <h1
            className="font-heading text-2xl font-bold text-[#1f2933] mb-8"
          >
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* ── Left: Address + options ── */}
            <div className="space-y-6">

              {/* Sign-in prompt */}
              {!user && (
                <div className="flex items-start gap-3 bg-[#f36b21]/5 border border-[#f36b21]/20 rounded-2xl p-4">
                  <LogIn className="w-4 h-4 text-[#f36b21] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1f2933]">
                      Sign in for faster checkout
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Use saved addresses and track your orders.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="text-xs font-semibold text-[#f36b21] hover:underline flex-shrink-0"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Delivery location */}
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-white rounded-xl border border-slate-100 px-4 py-3">
                <MapPin className="w-4 h-4 text-[#f36b21]" />
                <span>Delivering to</span>
                <span className="font-semibold text-[#1f2933]">{currentCity}</span>
                <Link href="/" className="ml-auto text-xs text-[#f36b21] hover:underline">Change</Link>
              </div>

              {/* Saved addresses */}
              {user && savedAddresses.length > 0 && (
                <section>
                  <h2
                    className="font-heading font-bold text-[#1f2933] mb-3"
                  >
                    Saved Addresses
                  </h2>
                  <div className="space-y-3">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => { setSelectedSaved(addr.id); setShowNewForm(false); }}
                        className={`w-full text-left flex items-start gap-3 p-4 rounded-2xl border transition-all ${selectedSaved === addr.id && !showNewForm
                            ? "border-[#f36b21] bg-[#f36b21]/5"
                            : "border-slate-100 bg-white hover:border-slate-200"
                          }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${selectedSaved === addr.id && !showNewForm
                              ? "border-[#f36b21] bg-[#f36b21]"
                              : "border-slate-300"
                            }`}
                        >
                          {selectedSaved === addr.id && !showNewForm && (
                            <Check className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1f2933] capitalize">{addr.label} — {addr.fullName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{addr.fullAddress}</p>
                          <p className="text-xs text-slate-400">{addr.phone}</p>
                        </div>
                      </button>
                    ))}

                    <button
                      onClick={() => { setShowNewForm(!showNewForm); setSelectedSaved(null); }}
                      className={`w-full text-left flex items-center gap-2 p-4 rounded-2xl border transition-all text-sm font-medium ${showNewForm
                          ? "border-[#f36b21] bg-[#f36b21]/5 text-[#f36b21]"
                          : "border-dashed border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                    >
                      + Deliver to a different address
                    </button>
                  </div>
                </section>
              )}

              {/* Address form */}
              {(showNewForm || savedAddresses.length === 0) && (
                <section>
                  <h2 className="font-heading font-bold text-[#1f2933] mb-3">
                    Delivery Address
                  </h2>
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Full Name" value={form.name} onChange={(v) => updateForm("name", v)} placeholder="Your name" required />
                      <Field label="Phone" value={form.phone} onChange={(v) => updateForm("phone", v)} placeholder="+91 98765 43210" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="House / Flat No." value={form.houseNo} onChange={(v) => updateForm("houseNo", v)} placeholder="B-42, 3rd Floor" required />
                      <Field label="Area / Colony" value={form.area} onChange={(v) => updateForm("area", v)} placeholder="Sector 15, Noida" required />
                    </div>
                    <Field label="Landmark (optional)" value={form.landmark} onChange={(v) => updateForm("landmark", v)} placeholder="Near metro station" />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="City" value={form.city} onChange={(v) => updateForm("city", v)} placeholder="Delhi" required />
                      <Field label="Pincode" value={form.pincode} onChange={(v) => updateForm("pincode", v)} placeholder="110001" required maxLength={6} />
                    </div>
                  </div>
                </section>
              )}

              {/* Notes */}
              <section>
                <h2 className="font-heading font-bold text-[#1f2933] mb-3">Order Notes</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any instructions for delivery? (optional)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-white text-sm text-[#1f2933] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21]/20 focus:border-[#f36b21]/40 transition-all resize-none"
                />
              </section>

              {/* Payment method */}
              <section>
                <h2 className="font-heading font-bold text-[#1f2933] mb-3">Payment</h2>
                <div className="flex items-center gap-3 bg-white border border-[#f36b21]/30 rounded-2xl px-5 py-4">
                  <div className="w-4 h-4 rounded-full border-2 border-[#f36b21] bg-[#f36b21] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1f2933]">Cash on Delivery</p>
                    <p className="text-xs text-slate-400 mt-0.5">Pay when your order arrives</p>
                  </div>
                  <Leaf className="w-4 h-4 text-[#f36b21] ml-auto" />
                </div>
              </section>
            </div>

            {/* ── Right: Summary ── */}
            <div className="lg:sticky lg:top-[88px] h-fit space-y-4">
              {/* Items accordion */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <button
                  onClick={() => setShowItems(!showItems)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-heading font-bold text-[#1f2933] text-sm">
                    {count} item{count !== 1 ? "s" : ""} in order
                  </span>
                  {showItems ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {showItems && (
                  <div className="border-t border-slate-50 divide-y divide-slate-50">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 px-5 py-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-300 absolute inset-0 m-auto" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#1f2933] line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-xs font-bold text-[#1f2933] flex-shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="bg-white rounded-2xl border border-slate-100 px-5 py-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-[#1f2933]">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Delivery</span>
                  {shipping === 0 ? (
                    <span className="font-medium text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-medium text-[#1f2933]">₹{shipping}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment</span>
                  <span className="font-medium text-[#1f2933]">COD</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="font-bold text-[#1f2933]">Total</span>
                  <span
                    className="text-xl font-bold text-[#f36b21]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Place order */}
              {!user ? (
                <button
                  onClick={() => setShowAuth(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#f36b21] hover:bg-[#e05e18] text-white font-bold text-sm h-12 rounded-xl transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Place Order
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={!isFormValid() || placing}
                  className="w-full flex items-center justify-center gap-2 bg-[#1f2933] hover:bg-[#323f4b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm h-12 rounded-xl transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {placing ? (
                    "Placing Order…"
                  ) : (
                    <><ShoppingBag className="w-4 h-4" /> Place Order (COD)</>
                  )}
                </button>
              )}

              {!isFormValid() && user && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Fill in all required address fields
                </div>
              )}

              <p className="text-center text-xs text-slate-400">
                By placing this order you agree to our{" "}
                <Link href="/terms" className="text-[#f36b21] hover:underline">Terms</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

function Field({
  label, value, onChange, placeholder, required, maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-[#f36b21] ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1f2933] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21]/20 focus:border-[#f36b21]/40 transition-all bg-white"
      />
    </div>
  );
}
