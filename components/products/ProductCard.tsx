"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Package, Check, MapPin, LogIn } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { resolveProductForLocation, isAvailableInLocation } from "@/lib/locationContent";
import { LOCATIONS } from "@/types/location";

function useProductState(product: Product) {
  const { location } = useLocation();
  const resolved = resolveProductForLocation(product, location);
  const available = isAvailableInLocation(product, location);
  const currentCity = LOCATIONS.find((l) => l.id === location)?.label ?? location;
  return { resolved, available, currentCity };
}

function useAddToCart(product: Product) {
  const { addItem } = useCart();
  const { user, openAuthModal } = useAuth();
  const [added, setAdded] = useState(false);

  function add(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      quantity: 1,
      slug: product.slug,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return { add, added, authed: !!user };
}

/* ─── Grid card ─── */
export function ProductCardGrid({ product }: { product: Product }) {
  const { resolved, available, currentCity } = useProductState(product);
  const { add, added, authed } = useAddToCart(resolved);

  const discount =
    resolved.compareAtPrice && resolved.compareAtPrice > resolved.price
      ? Math.round(((resolved.compareAtPrice - resolved.price) / resolved.compareAtPrice) * 100)
      : null;

  return (
    <div
      className={`group bg-white rounded-[24px] border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_-24px_rgba(31,41,51,0.22)] ${
        available
          ? "border-slate-100 hover:border-[#f36b21]/30"
          : "border-slate-100 hover:border-amber-200/60"
      }`}
    >
      {/* Image */}
      <Link href={`/products/${resolved.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
          {resolved.images[0] ? (
            <Image
              src={resolved.images[0]}
              alt={resolved.name}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!available ? "opacity-70" : ""}`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
              <Package className="w-10 h-10 text-slate-300 mb-2" />
              <span className="text-xs text-slate-300 font-medium" style={{ fontFamily: "var(--font-condensed)" }}>
                afixz store
              </span>
            </div>
          )}

          {resolved.featured && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#1f2933] text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
              Top Pick
            </span>
          )}
          {!resolved.featured && resolved.bestseller && (
            <span className="absolute top-3 left-3 bg-[#1f2933]/85 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
              Bestseller
            </span>
          )}
          {discount && available && (
            <span className="absolute top-3 right-3 bg-[#f36b21] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {resolved.rating ? (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#1f2933]/85 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-full">
              <Star className="w-3 h-3 fill-[#f36b21] text-[#f36b21]" />
              <span className="text-[11px] font-semibold">{resolved.rating.toFixed(1)}</span>
            </div>
          ) : null}
          {!resolved.inStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <Link href={`/products/${resolved.slug}`}>
          <h3
            className="text-[#1f2933] font-semibold text-[15px] leading-snug mb-1 line-clamp-2 hover:text-[#f36b21] transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {resolved.name}
          </h3>
        </Link>
        <div className="h-px w-10 bg-[#f36b21]/30 mb-2.5 transition-all duration-300 group-hover:w-16 group-hover:bg-[#f36b21]" />

        {/* Availability badge */}
        {!available && (
          <div className="flex items-center gap-1 mb-2.5">
            <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
            <span className="text-[11px] text-amber-600 font-medium">
              Not available in {currentCity}
            </span>
          </div>
        )}

        <div className="flex items-end justify-between gap-2">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.18em] text-slate-400 mb-0.5"
              style={{ fontFamily: "var(--font-condensed)" }}
            >
              {resolved.compareAtPrice ? "From" : "Price"}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-xl font-bold ${available ? "text-[#f36b21]" : "text-slate-400"}`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ₹{resolved.price.toLocaleString("en-IN")}
              </span>
              {resolved.compareAtPrice && (
                <span className="text-slate-400 text-xs line-through">
                  ₹{resolved.compareAtPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={add}
            disabled={!resolved.inStock || !available}
            className={`flex items-center gap-1.5 text-white text-[11px] font-bold uppercase tracking-wide px-3.5 py-2 rounded-full transition-all ${
              added
                ? "bg-emerald-500"
                : !available
                ? "bg-slate-300 cursor-not-allowed"
                : !authed
                ? "bg-[#f36b21] hover:bg-[#e05e18]"
                : "bg-[#1f2933] hover:bg-[#323f4b] disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
            style={{ fontFamily: "var(--font-condensed)" }}
          >
            {added ? (
              <><Check className="w-3.5 h-3.5" /> Added</>
            ) : !authed ? (
              <><LogIn className="w-3.5 h-3.5" /> Sign In</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> Add</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── List card ─── */
export function ProductCardList({ product }: { product: Product }) {
  const { resolved, available, currentCity } = useProductState(product);
  const { add, added, authed } = useAddToCart(resolved);

  return (
    <div
      className={`group flex gap-4 bg-white rounded-[20px] border p-4 transition-all duration-300 ${
        available
          ? "border-slate-100 hover:border-[#f36b21]/25 hover:shadow-[0_8px_24px_-8px_rgba(31,41,51,0.14)]"
          : "border-slate-100 hover:border-amber-200/50"
      }`}
    >
      <Link href={`/products/${resolved.slug}`} className="flex-shrink-0">
        <div className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-xl overflow-hidden bg-slate-50">
          {resolved.images[0] ? (
            <Image
              src={resolved.images[0]}
              alt={resolved.name}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!available ? "opacity-70" : ""}`}
              sizes="144px"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <Link href={`/products/${resolved.slug}`}>
            <h3
              className="text-[#1f2933] font-semibold text-[15px] leading-snug hover:text-[#f36b21] transition-colors line-clamp-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {resolved.name}
            </h3>
          </Link>
          {resolved.shortDescription && (
            <p className="text-[#1f2933]/55 text-xs mt-0.5 line-clamp-2">
              {resolved.shortDescription}
            </p>
          )}
          <div className="h-px w-8 bg-[#f36b21]/40 mt-2" />

          {/* Availability badge */}
          {!available && (
            <div className="flex items-center gap-1 mt-1.5">
              <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span className="text-[11px] text-amber-600 font-medium">
                Not available in {currentCity}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-3">
            {resolved.rating ? (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Star className="w-3 h-3 fill-[#f36b21] text-[#f36b21]" />
                {resolved.rating.toFixed(1)}
              </span>
            ) : null}
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-lg font-bold ${available ? "text-[#f36b21]" : "text-slate-400"}`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ₹{resolved.price.toLocaleString("en-IN")}
              </span>
              {resolved.compareAtPrice && (
                <span className="text-slate-400 text-xs line-through">
                  ₹{resolved.compareAtPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={add}
            disabled={!resolved.inStock || !available}
            className={`flex items-center gap-1.5 text-white text-[11px] font-bold uppercase tracking-wide px-4 py-2 rounded-full transition-all ${
              added
                ? "bg-emerald-500"
                : !available
                ? "bg-slate-300 cursor-not-allowed"
                : !authed
                ? "bg-[#f36b21] hover:bg-[#e05e18]"
                : "bg-[#1f2933] hover:bg-[#323f4b] disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
            style={{ fontFamily: "var(--font-condensed)" }}
          >
            {added ? (
              <><Check className="w-3.5 h-3.5" /> Added</>
            ) : !authed ? (
              <><LogIn className="w-3.5 h-3.5" /> Sign In</>
            ) : (
              <>Add <span className="text-[10px]">→</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeletons ─── */
export function ProductCardGridSkeleton() {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-px w-10 skeleton" />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-3 w-10 skeleton rounded" />
            <div className="h-6 w-20 skeleton rounded" />
          </div>
          <div className="h-8 w-16 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductCardListSkeleton() {
  return (
    <div className="flex gap-4 bg-white rounded-[20px] border border-slate-100 p-4">
      <div className="h-32 w-32 skeleton rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 w-2/3 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
        <div className="h-px w-8 skeleton mt-2" />
        <div className="flex items-center justify-between mt-3">
          <div className="h-5 w-20 skeleton rounded" />
          <div className="h-8 w-16 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}
