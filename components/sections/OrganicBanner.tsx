import { CheckCircle2, Leaf, Truck, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "All products sourced from certified organic farms and suppliers.",
  },
  {
    icon: Truck,
    title: "Same-Day Delivery",
    description: "Order before 12 PM for same-day delivery across Delhi NCR.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description: "7-day return on all products. No questions asked.",
  },
  {
    icon: CheckCircle2,
    title: "Expert Curated",
    description: "Handpicked by AfixZ gardening experts for your garden's needs.",
  },
];

export function OrganicBanner() {
  return (
    <section className="py-16 sm:py-20 bg-[#0d1117] relative overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 rounded-full bg-[#f36b21]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 rounded-full bg-emerald-900/20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[11px] tracking-[0.28em] uppercase text-[#f36b21] font-medium font-sans">
            why choose us
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2">
            Grown with Purpose
          </h2>
          <p className="text-white/50 text-sm mt-2 max-w-md mx-auto">
            Everything you need to build a thriving garden — organic, sustainable, and beautiful.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white/[0.04] border border-white/[0.08] rounded-[20px] p-6 hover:bg-white/[0.07] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f36b21]/15 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#f36b21]" />
              </div>
              <h3 className="font-heading font-bold text-white text-base mb-1.5">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
