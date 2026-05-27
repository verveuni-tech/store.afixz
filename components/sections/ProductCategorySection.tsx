"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductsByCategory } from "@/lib/firebase/products";
import {
  ProductCardGrid,
  ProductCardList,
  ProductCardGridSkeleton,
  ProductCardListSkeleton,
} from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

interface ProductCategorySectionProps {
  categorySlug: string;
  displaySubtitle: string;
  displayLabel: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  layout: "grid" | "list";
  background: "white" | "gray";
  placeholderProducts: Product[];
}

export function ProductCategorySection({
  categorySlug,
  displaySubtitle,
  displayLabel,
  title,
  ctaLabel,
  ctaHref,
  layout,
  background,
  placeholderProducts,
}: ProductCategorySectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsByCategory(categorySlug, layout === "grid" ? 4 : 4)
      .then((data) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categorySlug, layout]);

  const displayProducts = !loading && products.length === 0 ? placeholderProducts : products;
  const bgClass = background === "gray" ? "bg-[#f9fafb]" : "bg-white";

  return (
    <section className={`py-16 sm:py-20 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header — exact match to service site */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            {/* Cormorant Garamond italic subtitle */}
            <p
              className="text-[#f36b21] text-xl italic mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {displaySubtitle}
            </p>
            {/* Orange line + label */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-px bg-[#f36b21]/40" />
              <span
                className="text-[11px] uppercase tracking-[0.22em] text-slate-400"
                style={{ fontFamily: "var(--font-condensed)" }}
              >
                {displayLabel}
              </span>
            </div>
            {/* Bold Raleway title */}
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#1f2933]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h2>
          </div>

          {/* CTA pill button */}
          <Link
            href={ctaHref}
            className="hidden sm:inline-flex items-center gap-2 border border-[#1f2933]/15 text-[#1f2933] text-[12px] font-semibold uppercase tracking-[0.12em] px-5 py-2.5 rounded-full hover:border-[#f36b21]/40 hover:text-[#f36b21] transition-all group flex-shrink-0"
            style={{ fontFamily: "var(--font-condensed)" }}
          >
            {ctaLabel}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Product grid / list */}
        {layout === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardGridSkeleton key={i} />)
              : displayProducts.slice(0, 4).map((p) => (
                  <ProductCardGrid key={p.id} product={p} />
                ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardListSkeleton key={i} />)
              : displayProducts.slice(0, 4).map((p) => (
                  <ProductCardList key={p.id} product={p} />
                ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 sm:hidden text-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 border border-[#1f2933]/15 text-[#1f2933] text-[11px] font-semibold uppercase tracking-[0.12em] px-5 py-2.5 rounded-full hover:border-[#f36b21]/40 hover:text-[#f36b21] transition-all"
            style={{ fontFamily: "var(--font-condensed)" }}
          >
            {ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
