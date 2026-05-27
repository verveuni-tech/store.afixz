"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Sprout, ShoppingBag } from "lucide-react";
import { getAllCategories } from "@/lib/firebase/products";
import type { ProductCategory } from "@/types/product";

const FALLBACK_CATEGORIES: ProductCategory[] = [
  {
    id: "plants",
    name: "Plants",
    slug: "plants",
    description: "Indoor & outdoor varieties",
    image: "",
  },
  {
    id: "compost",
    name: "Vermicompost",
    slug: "compost",
    description: "100% organic khad for your garden",
    image: "",
  },
  {
    id: "pots",
    name: "Pots & Planters",
    slug: "pots",
    description: "Ceramic, hanging & premium planters",
    image: "",
  },
];

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string; emoji: string }> = {
  plants: { icon: Leaf, color: "bg-emerald-50 text-emerald-700", emoji: "🌿" },
  compost: { icon: Sprout, color: "bg-amber-50 text-amber-700", emoji: "🌱" },
  pots: { icon: ShoppingBag, color: "bg-slate-100 text-slate-700", emoji: "🪴" },
};

export function CategorySection() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCategories()
      .then((cats) => {
        setCategories(cats.length > 0 ? cats : FALLBACK_CATEGORIES);
      })
      .catch(() => setCategories(FALLBACK_CATEGORIES))
      .finally(() => setLoading(false));
  }, []);

  const displayCats = loading ? FALLBACK_CATEGORIES : categories;

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-10">
          <span className="text-[11px] tracking-[0.28em] uppercase text-[#f36b21] font-medium font-sans">
            browse by category
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1f2933] mt-1">
            Shop Our Collections
          </h2>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {displayCats.slice(0, 3).map((cat, i) => {
            const meta = CATEGORY_META[cat.slug] ?? {
              icon: Leaf,
              color: "bg-slate-100 text-slate-700",
              emoji: "🌱",
            };
            const Icon = meta.icon;

            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`group relative overflow-hidden rounded-[24px] border border-slate-100 bg-[#f9fafb] transition-all duration-300 hover:-translate-y-1 hover:border-[#f36b21]/25 hover:shadow-[0_14px_34px_-12px_rgba(31,41,51,0.14)] ${loading ? "opacity-60" : ""}`}
                style={{ minHeight: i === 0 ? 300 : 220 }}
              >
                {/* Category image */}
                {cat.image ? (
                  <div className="absolute inset-0">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1f2933]/80 via-[#1f2933]/30 to-transparent" />
                  </div>
                ) : (
                  /* Placeholder */
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl opacity-20 select-none">{meta.emoji}</span>
                  </div>
                )}

                {/* Content */}
                <div className={`relative z-10 p-6 h-full flex flex-col justify-between ${cat.image ? "text-white" : ""}`}>
                  <div className={`w-10 h-10 rounded-xl ${cat.image ? "bg-white/20 text-white" : meta.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h3
                      className={`font-heading font-bold text-xl mb-1 ${cat.image ? "text-white" : "text-[#1f2933]"}`}
                    >
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className={`text-sm mb-3 ${cat.image ? "text-white/70" : "text-[#1f2933]/55"}`}>
                        {cat.description}
                      </p>
                    )}
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all ${cat.image ? "text-[#f36b21]" : "text-[#f36b21]"}`}
                    >
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
