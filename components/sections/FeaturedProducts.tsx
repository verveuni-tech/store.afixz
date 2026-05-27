"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/firebase/products";
import { ProductCardGrid as ProductCard, ProductCardGridSkeleton as ProductCardSkeleton } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

const PLACEHOLDER_PRODUCTS: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: `placeholder-${i}`,
  name: ["Snake Plant", "Money Plant", "Vermicompost 5kg", "Ceramic Pot"][i % 4],
  slug: `placeholder-${i}`,
  categoryId: "",
  shortDescription: "Premium quality product",
  description: "",
  images: [],
  price: [299, 199, 449, 599][i % 4],
  compareAtPrice: [399, 249, 549, 799][i % 4],
  stock: 10,
  inStock: true,
  featured: true,
  bestseller: i % 3 === 0,
  rating: 4.5,
}));

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getFeaturedProducts(8)
      .then((data) => setProducts(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const isEmpty = !loading && !error && products.length === 0;

  return (
    <section className="py-16 sm:py-20 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[11px] tracking-[0.28em] uppercase text-[#f36b21] font-medium font-sans">
              handpicked for you
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1f2933] mt-1">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop?filter=featured"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#1f2933]/60 hover:text-[#f36b21] transition-colors group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}

          {error && (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 text-sm">Could not load products. Please try again.</p>
            </div>
          )}

          {/* When Firestore is empty — show placeholder cards with no real data */}
          {isEmpty &&
            PLACEHOLDER_PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}

          {!loading &&
            !error &&
            products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop?filter=featured"
            className="inline-flex items-center gap-2 border border-[#1f2933]/15 text-[#1f2933] text-sm font-semibold px-5 py-2.5 rounded-full hover:border-[#f36b21]/40 hover:text-[#f36b21] transition-all"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
