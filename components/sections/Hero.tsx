"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const TRUST_ITEMS = [
  "100% Organic Certified",
  "Delhi NCR Delivery",
  "Expert Curated",
];

const RIGHT_CARDS = [
  {
    emoji: "🌿",
    label: "Plants",
    tagline: "Indoor & outdoor varieties",
    slug: "plants",
    gradient: "from-emerald-900/80 to-emerald-950/90",
    accent: "#4ade80",
  },
  {
    emoji: "🌱",
    label: "Vermicompost",
    tagline: "100% organic khad",
    slug: "compost",
    gradient: "from-amber-900/80 to-amber-950/90",
    accent: "#fbbf24",
  },
  {
    emoji: "🪴",
    label: "Pots & Planters",
    tagline: "Ceramic & premium",
    slug: "pots",
    gradient: "from-stone-800/80 to-stone-900/90",
    accent: "#d6d3d1",
  },
];

export function Hero() {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveCard((p) => (p + 1) % RIGHT_CARDS.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-5 sm:py-6 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main hero container — matches AfixZ service site */}
        <div
          className="relative overflow-hidden rounded-[2rem] border border-black/[0.06]"
          style={{ boxShadow: "0 30px 90px rgba(15,23,42,0.12)" }}
        >
          <div className="grid lg:grid-cols-[1.08fr_0.92fr] min-h-[540px] lg:min-h-[580px]">

            {/* ── Left panel ── */}
            <div className="relative flex flex-col justify-center px-8 sm:px-12 lg:px-14 py-14 lg:py-16 bg-[#0d1117] overflow-hidden">

              {/* Ambient orange glow */}
              <div className="pointer-events-none absolute top-0 left-0 w-[280px] h-[280px] rounded-full bg-orange-500/10 blur-3xl" />
              {/* Dot texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />

              <div className="relative z-10">
                {/* Eyebrow */}
                <p
                  className="text-[10px] tracking-[0.28em] uppercase text-[#f36b21] font-medium mb-5"
                  style={{ fontFamily: "var(--font-condensed)" }}
                >
                  organic gardening store · delhi ncr
                </p>

                {/* Headline */}
                <h1
                  className="text-white font-extrabold leading-[0.94] tracking-[-0.05em] mb-5"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(2.65rem, 8vw, 4.8rem)",
                    maxWidth: "13ch",
                  }}
                >
                  Grow something
                  {" "}
                  <span className="text-[#f36b21]">beautiful</span>
                  {" "}today.
                </h1>

                <p className="text-white/60 text-[14px] sm:text-[15px] max-w-[38ch] mb-8 leading-relaxed">
                  Premium plants, organic vermicompost &amp; handpicked pots —
                  curated by AfixZ gardening experts and delivered to your door.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 group"
                    style={{ boxShadow: "0 18px 40px rgba(249,115,22,0.32)" }}
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/shop?filter=bestseller"
                    className="inline-flex items-center gap-2 border border-white/20 text-white/80 hover:bg-white/5 font-medium px-6 py-3 rounded-2xl transition-all"
                  >
                    Bestsellers
                  </Link>
                </div>

                {/* Trust strip */}
                <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-wrap items-center gap-x-5 gap-y-2">
                  {TRUST_ITEMS.map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-white/35 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-[#f36b21]" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right panel ── */}
            <div className="relative hidden lg:flex flex-col justify-center p-8 bg-[#111820]">
              {/* Ambient green glow */}
              <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 rounded-full bg-emerald-900/30 blur-3xl" />

              {/* Floating top badges */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                <div className="bg-black/30 backdrop-blur-lg rounded-2xl px-4 py-2.5 border border-white/10">
                  <p className="text-white font-bold text-sm">Same Day</p>
                  <p className="text-white/50 text-[11px]">Delivery available</p>
                </div>
                <div className="bg-black/30 backdrop-blur-lg rounded-2xl px-4 py-2.5 border border-white/10">
                  <p className="text-white font-bold text-sm">4.8 ★</p>
                  <p className="text-white/50 text-[11px]">Rated products</p>
                </div>
              </div>

              {/* Category cards */}
              <div className="relative z-10 flex flex-col gap-3 mt-16 mb-4">
                {RIGHT_CARDS.map((card, i) => (
                  <Link
                    key={card.slug}
                    href={`/shop?category=${card.slug}`}
                    onClick={() => setActiveCard(i)}
                    className={`group relative overflow-hidden rounded-[1.5rem] px-6 py-5 flex items-center gap-5 border transition-all duration-500 cursor-pointer ${
                      activeCard === i
                        ? "border-white/20 bg-white/[0.08] scale-[1.02]"
                        : "border-white/[0.05] bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-300 ${
                        activeCard === i ? "scale-110" : ""
                      }`}
                      style={{
                        background: activeCard === i
                          ? `linear-gradient(135deg, ${card.accent}22, ${card.accent}11)`
                          : "rgba(255,255,255,0.05)",
                        border: `1px solid ${activeCard === i ? card.accent + "40" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      {card.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-[15px]" style={{ fontFamily: "var(--font-heading)" }}>
                        {card.label}
                      </p>
                      <p className="text-white/45 text-xs mt-0.5">{card.tagline}</p>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
                        activeCard === i ? "text-[#f36b21] translate-x-0" : "text-white/25 -translate-x-1"
                      }`}
                    />
                  </Link>
                ))}
              </div>

              {/* Slide dots */}
              <div className="flex items-center justify-center gap-2 mt-2">
                {RIGHT_CARDS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCard(i)}
                    className={`rounded-full transition-all duration-300 ${
                      activeCard === i
                        ? "h-2 w-8 bg-white"
                        : "h-2 w-2 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
