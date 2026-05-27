"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBestsellerProducts } from "@/lib/firebase/products";
import { ProductCardGrid as ProductCard, ProductCardGridSkeleton as ProductCardSkeleton } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

export function BestsellerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBestsellerProducts(4)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[11px] tracking-[0.28em] uppercase text-[#f36b21] font-medium font-sans">
              top picks
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1f2933] mt-1">
              Bestsellers
            </h2>
          </div>
          <Link
            href="/shop?filter=bestseller"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#1f2933]/60 hover:text-[#f36b21] transition-colors group"
          >
            See All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
