"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Package, Leaf, LogIn } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const SHIPPING_THRESHOLD = 499;
const SHIPPING_COST = 49;

export default function CartPage() {
  const { items, removeItem, updateQty, total, count } = useCart();
  const { user, loading, openAuthModal } = useAuth();

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  /* ── Auth gate ── */
  if (!loading && !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f9fafb] pt-[72px] flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-[#f36b21]/10 flex items-center justify-center mx-auto mb-5">
              <ShoppingCart className="w-9 h-9 text-[#f36b21]" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#1f2933] mb-2">Sign in to view cart</h2>
            <p className="text-slate-500 text-sm mb-7">
              Create an account or sign in to add items to your cart and place orders.
            </p>
            <button
              onClick={openAuthModal}
              className="inline-flex items-center gap-2 bg-[#1f2933] hover:bg-[#323f4b] text-white font-semibold text-sm px-7 py-3 rounded-full transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In / Create Account
            </button>
            <div className="mt-6">
              <Link href="/" className="text-sm text-slate-400 hover:text-[#f36b21] transition-colors">
                ← Continue Browsing
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (count === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f9fafb] pt-[72px] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
              <ShoppingCart className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#1f2933] mb-2">Your cart is empty</h2>
            <p className="text-slate-500 text-sm mb-7">Add some plants, compost or pots to get started.</p>
            <div className="flex items-center justify-center gap-3">
              {[
                { label: "Plants", href: "/shop/plants" },
                { label: "Compost", href: "/shop/compost" },
                { label: "Pots", href: "/shop/pots" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-5 py-2.5 text-sm font-semibold border border-slate-200 rounded-full text-[#1f2933] hover:border-[#f36b21]/50 hover:text-[#f36b21] transition-all"
                >
                  {l.label}
                </Link>
              ))}
            </div>
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
          <h1 className="font-heading text-2xl font-bold text-[#1f2933] mb-8">
            Your Cart{" "}
            <span className="text-slate-400 font-normal text-lg">({count} item{count !== 1 ? "s" : ""})</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 bg-white rounded-2xl border border-slate-100 p-4 hover:border-slate-200 transition-colors"
                >
                  {/* Image */}
                  <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-50">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="w-8 h-8 text-slate-300" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`}>
                      <h3
                        className="font-semibold text-[#1f2933] text-sm hover:text-[#f36b21] transition-colors line-clamp-2 leading-snug"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {item.name}
                      </h3>
                    </Link>
                    <p
                      className="text-[#f36b21] font-bold text-base mt-1"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#1f2933] hover:bg-slate-50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-[#1f2933]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, Math.min(item.stock, item.quantity + 1))}
                          className="w-8 h-8 flex items-center justify-center text-[#1f2933] hover:bg-slate-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Line total */}
                        <span className="text-sm font-bold text-[#1f2933]">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-slate-300 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue shopping */}
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#f36b21] transition-colors mt-2"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div className="lg:sticky lg:top-[88px] h-fit">
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-50">
                  <h2 className="font-heading font-bold text-[#1f2933]">Order Summary</h2>
                </div>
                <div className="px-6 py-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal ({count} items)</span>
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
                  {shipping > 0 && (
                    <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
                      Add ₹{(SHIPPING_THRESHOLD - total).toLocaleString("en-IN")} more for free delivery
                    </p>
                  )}
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="font-bold text-[#1f2933]">Total</span>
                    <span
                      className="font-bold text-xl text-[#f36b21]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 bg-[#1f2933] hover:bg-[#323f4b] text-white font-bold text-sm h-12 rounded-xl transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-slate-400">
                    <Leaf className="w-3 h-3 text-[#f36b21]" />
                    Cash on Delivery available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
