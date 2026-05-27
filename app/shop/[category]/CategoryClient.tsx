"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronLeft, Leaf, Package, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import {
  ProductCardGrid,
  ProductCardGridSkeleton,
} from "@/components/products/ProductCard";
import { getProductsByCategory } from "@/lib/firebase/products";
import { resolveProductsForLocation } from "@/lib/locationContent";
import { useLocation } from "@/context/LocationContext";
import { LOCATIONS } from "@/types/location";
import type { Product } from "@/types/product";

type SortKey = "newest" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
];

const CATEGORY_INFO: Record<string, { label: string; subtitle: string; color: string }> = {
  plants: {
    label: "Plants",
    subtitle: "Bring nature indoors — and outdoors",
    color: "from-emerald-900/80 to-[#0d1117]",
  },
  compost: {
    label: "Compost & Organic Khad",
    subtitle: "Nourish your garden, naturally",
    color: "from-amber-900/70 to-[#0d1117]",
  },
  pots: {
    label: "Pots & Planters",
    subtitle: "Every plant deserves a beautiful home",
    color: "from-slate-700/80 to-[#0d1117]",
  },
};

export function CategoryClient({ categorySlug }: { categorySlug: string }) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  const { location } = useLocation();

  const catInfo = CATEGORY_INFO[categorySlug] ?? {
    label: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
    subtitle: "Browse our collection",
    color: "from-slate-800 to-[#0d1117]",
  };

  const currentLocation = LOCATIONS.find((l) => l.id === location);

  useEffect(() => {
    setLoading(true);
    getProductsByCategory(categorySlug, 60).then((p) => {
      setAllProducts(p);
      setLoading(false);
    });
  }, [categorySlug]);

  const products = useMemo(() => {
    // 1. Resolve location-specific prices (no filtering — all products shown)
    let list = resolveProductsForLocation(allProducts, location);

    // 2. Stock filter
    if (inStockOnly) list = list.filter((p) => p.inStock);

    // 3. Sort
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default: // newest — keep Firestore order (createdAt desc)
        break;
    }

    return list;
  }, [allProducts, location, inStockOnly, sort]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fafb] pt-[72px]">
        {/* Category header */}
        <div className={`bg-gradient-to-r ${catInfo.color} text-white`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Home
            </Link>
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-[#f36b21]" />
                  <span
                    className="text-[11px] font-semibold text-[#f36b21] uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-condensed)" }}
                  >
                    AfixZ Store
                  </span>
                </div>
                <h1
                  className="text-3xl sm:text-4xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {catInfo.label}
                </h1>
                <p
                  className="text-white/50 mt-1 text-base"
                  style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
                >
                  {catInfo.subtitle}
                </p>
              </div>
              <div className="flex-shrink-0 text-right hidden sm:block">
                <div className="flex items-center gap-1.5 text-white/50 text-sm justify-end">
                  <MapPin className="w-3.5 h-3.5 text-[#f36b21]" />
                  {currentLocation?.label}
                </div>
                <p className="text-white/30 text-xs mt-0.5">
                  {loading ? "…" : `${products.length} products`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Filter bar */}
          <div className="flex items-center justify-between gap-4 mb-7">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </div>
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  inStockOnly
                    ? "border-[#f36b21] bg-[#f36b21]/5 text-[#f36b21]"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${inStockOnly ? "bg-[#f36b21]" : "bg-slate-300"}`}
                />
                In Stock
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 text-[#1f2933] bg-white focus:outline-none focus:ring-2 focus:ring-[#f36b21]/20"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardGridSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState slug={categorySlug} locationLabel={currentLocation?.label} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {products.map((p) => (
                <ProductCardGrid key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function EmptyState({ slug, locationLabel }: { slug: string; locationLabel?: string }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
        <Package className="w-10 h-10 text-slate-300" />
      </div>
      <h3
        className="text-xl font-bold text-[#1f2933] mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        No products found
      </h3>
      <p className="text-slate-500 text-sm max-w-xs mx-auto">
        {locationLabel
          ? `No ${slug} products available in ${locationLabel} right now.`
          : `No products in this category yet.`}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-[#f36b21] hover:underline"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
}
