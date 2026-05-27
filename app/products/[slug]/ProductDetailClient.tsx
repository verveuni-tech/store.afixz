"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Star, Package, ChevronLeft, Plus, Minus,
  Check, Truck, ShieldCheck, Leaf, MapPin, AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { getProductBySlug } from "@/lib/firebase/products";
import { resolveProductForLocation, isAvailableInLocation } from "@/lib/locationContent";
import { LOCATIONS } from "@/types/location";
import type { Product } from "@/types/product";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i <= Math.round(rating) ? "fill-[#f36b21] text-[#f36b21]" : "text-slate-200 fill-slate-200"}`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-[#1f2933]">{rating.toFixed(1)}</span>
      {count > 0 && <span className="text-sm text-slate-400">({count} reviews)</span>}
    </div>
  );
}

export function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);
  const { addItem } = useCart();
  const { location } = useLocation();

  const currentLocation = LOCATIONS.find((l) => l.id === location);

  useEffect(() => {
    getProductBySlug(slug).then((p) => {
      if (!p) { setNotFound(true); setLoading(false); return; }
      setProduct(p);
      setLoading(false);
    });
  }, [slug]);

  const displayProduct = product ? resolveProductForLocation(product, location) : null;
  const unavailable = product ? !isAvailableInLocation(product, location) : false;

  const discount =
    displayProduct?.compareAtPrice && displayProduct.compareAtPrice > (displayProduct.price ?? 0)
      ? Math.round(
          ((displayProduct.compareAtPrice - displayProduct.price) / displayProduct.compareAtPrice) * 100
        )
      : null;

  function handleAddToCart() {
    if (!displayProduct) return;
    addItem({
      productId: displayProduct.id,
      name: displayProduct.name,
      price: displayProduct.price,
      image: displayProduct.images[0] ?? "",
      quantity: qty,
      slug: displayProduct.slug,
      stock: displayProduct.stock,
    });
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  }

  if (loading) return <DetailSkeleton />;
  if (notFound || !displayProduct) return <NotFound />;

  const images = displayProduct.images.length > 0 ? displayProduct.images : [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fafb] pt-[72px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-[#f36b21] transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/shop/${displayProduct.categorySlug}`} className="hover:text-[#f36b21] transition-colors capitalize">
              {displayProduct.categorySlug ?? "Shop"}
            </Link>
            <span>/</span>
            <span className="text-[#1f2933] font-medium line-clamp-1">{displayProduct.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* ── Left: Image gallery ── */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-sm">
                {images[activeImage] ? (
                  <Image
                    src={images[activeImage]}
                    alt={displayProduct.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                    <Package className="w-20 h-20 text-slate-200 mb-3" />
                    <span
                      className="text-sm text-slate-300 font-medium"
                      style={{ fontFamily: "var(--font-condensed)" }}
                    >
                      AfixZ Store
                    </span>
                  </div>
                )}

                {/* Badges overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {displayProduct.featured && (
                    <span className="bg-white/90 backdrop-blur-sm text-[#1f2933] text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-sm">
                      Top Pick
                    </span>
                  )}
                  {!displayProduct.featured && displayProduct.bestseller && (
                    <span className="bg-[#1f2933]/85 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                      Bestseller
                    </span>
                  )}
                </div>
                {discount && (
                  <span className="absolute top-4 right-4 bg-[#f36b21] text-white text-sm font-bold px-2.5 py-1 rounded-full shadow">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activeImage ? "border-[#f36b21]" : "border-transparent hover:border-slate-300"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Product info ── */}
            <div className="flex flex-col gap-6">
              {/* Category + name */}
              <div>
                {displayProduct.categorySlug && (
                  <Link
                    href={`/shop/${displayProduct.categorySlug}`}
                    className="inline-block text-[11px] font-semibold text-[#f36b21] uppercase tracking-[0.2em] mb-2 hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "var(--font-condensed)" }}
                  >
                    {displayProduct.categorySlug}
                  </Link>
                )}
                <h1
                  className="text-3xl font-bold text-[#1f2933] leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {displayProduct.name}
                </h1>
                <div className="h-[3px] w-12 bg-[#f36b21] rounded-full mt-3" />
              </div>

              {/* Rating */}
              {displayProduct.rating ? (
                <StarRating rating={displayProduct.rating} count={displayProduct.reviewCount ?? 0} />
              ) : null}

              {/* Price block */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                {unavailable ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <p className="text-sm">
                      Not available in{" "}
                      <span className="font-medium text-[#1f2933]">{currentLocation?.label}</span>.
                      Change location to order.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span
                        className="text-4xl font-bold text-[#f36b21]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        ₹{displayProduct.price.toLocaleString("en-IN")}
                      </span>
                      {displayProduct.compareAtPrice && (
                        <span className="text-slate-400 text-lg line-through">
                          ₹{displayProduct.compareAtPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                      {discount && (
                        <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {discount}% off
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3 h-3 text-[#f36b21]" />
                      <span>Delivering to {currentLocation?.label}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Short description */}
              {displayProduct.shortDescription && (
                <p className="text-[#1f2933]/70 text-[15px] leading-relaxed">
                  {displayProduct.shortDescription}
                </p>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2">
                {displayProduct.inStock ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm font-medium text-emerald-600">In Stock</span>
                    {displayProduct.stock <= 10 && (
                      <span className="text-xs text-amber-600">
                        — Only {displayProduct.stock} left
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-sm font-medium text-red-600">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Qty + CTA */}
              {!unavailable && displayProduct.inStock && (
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Qty selector */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-12 flex items-center justify-center text-[#1f2933] hover:bg-slate-50 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span
                      className="w-10 text-center text-[#1f2933] font-semibold text-sm"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(displayProduct.stock, qty + 1))}
                      className="w-10 h-12 flex items-center justify-center text-[#1f2933] hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all ${
                      cartAdded
                        ? "bg-emerald-500 text-white"
                        : "bg-[#1f2933] hover:bg-[#323f4b] text-white"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {cartAdded ? (
                      <><Check className="w-4 h-4" /> Added to Cart</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                    )}
                  </button>

                  {/* Buy now */}
                  <Link
                    href="/cart"
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl border-2 border-[#f36b21] text-[#f36b21] font-bold text-sm hover:bg-[#f36b21] hover:text-white transition-all flex-shrink-0"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Buy Now
                  </Link>
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: <Truck className="w-4 h-4" />, label: "Fast Delivery", sub: "2–5 days" },
                  { icon: <ShieldCheck className="w-4 h-4" />, label: "Healthy Plants", sub: "Guaranteed" },
                  { icon: <Leaf className="w-4 h-4" />, label: "Organic", sub: "Natural inputs" },
                ].map((badge) => (
                  <div key={badge.label} className="flex flex-col items-center text-center gap-1 bg-white rounded-xl p-3 border border-slate-100">
                    <span className="text-[#f36b21]">{badge.icon}</span>
                    <p className="text-[11px] font-semibold text-[#1f2933]">{badge.label}</p>
                    <p className="text-[10px] text-slate-400">{badge.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom sections ── */}
          <div className="mt-14 space-y-10">

            {/* About This Item */}
            {displayProduct.aboutThisItem && displayProduct.aboutThisItem.length > 0 && (
              <section>
                <SectionHeading>About This Item</SectionHeading>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:p-8">
                  <ul className="space-y-3">
                    {displayProduct.aboutThisItem.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-[#f36b21] flex-shrink-0" />
                        <span className="text-[#1f2933]/80 text-[15px] leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Specifications */}
            {displayProduct.specifications && displayProduct.specifications.length > 0 && (
              <section>
                <SectionHeading>Specifications</SectionHeading>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  {displayProduct.specifications.map((spec, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 px-6 py-3.5 ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                      } ${i !== displayProduct.specifications!.length - 1 ? "border-b border-slate-100" : ""}`}
                    >
                      <span
                        className="text-sm font-semibold text-[#1f2933]/60 w-40 flex-shrink-0"
                        style={{ fontFamily: "var(--font-condensed)" }}
                      >
                        {spec.label}
                      </span>
                      <span className="text-sm text-[#1f2933] font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            {displayProduct.description && (
              <section>
                <SectionHeading>Description</SectionHeading>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:p-8">
                  <p className="text-[#1f2933]/75 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {displayProduct.description}
                  </p>
                </div>
              </section>
            )}

          </div>
        </div>
      </main>
    </>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2
        className="text-xl font-bold text-[#1f2933] whitespace-nowrap"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {children}
      </h2>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fafb] pt-[72px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="h-4 w-48 rounded skeleton mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="aspect-square rounded-[2rem] skeleton" />
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="h-3 w-20 rounded skeleton" />
                <div className="h-9 w-3/4 rounded skeleton" />
                <div className="h-1 w-12 rounded skeleton" />
              </div>
              <div className="h-8 w-40 rounded skeleton" />
              <div className="h-24 rounded-2xl skeleton" />
              <div className="h-16 rounded-xl skeleton" />
              <div className="h-12 rounded-xl skeleton" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fafb] pt-[72px] flex items-center justify-center">
        <div className="text-center px-4">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2
            className="text-xl font-bold text-[#1f2933] mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Product not found
          </h2>
          <p className="text-slate-500 text-sm mb-6">This product may have been removed or the link is incorrect.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#f36b21] hover:underline"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
      </main>
    </>
  );
}
