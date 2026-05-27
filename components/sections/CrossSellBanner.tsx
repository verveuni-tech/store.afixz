import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

export function CrossSellBanner() {
  return (
    <section className="py-12 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#1f2933] rounded-[2rem] px-8 sm:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Glow */}
          <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 rounded-full bg-[#f36b21]/10 blur-3xl" />

          <div className="relative z-10 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <Wrench className="w-4 h-4 text-[#f36b21]" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#f36b21] font-medium">
                afixz services
              </span>
            </div>
            <h3 className="font-heading text-white font-bold text-xl sm:text-2xl mb-2">
              Need professional garden maintenance?
            </h3>
            <p className="text-white/50 text-sm max-w-sm">
              Our expert gardeners will care for your plants while you focus on what matters.
              Same-day bookings available.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <Link
              href="https://afixz.com/garden-care"
              target="_blank"
              className="inline-flex items-center gap-2.5 bg-[#f36b21] hover:bg-[#e85d0f] text-white font-semibold px-6 py-3 rounded-2xl transition-all hover:-translate-y-0.5 group whitespace-nowrap"
              style={{ boxShadow: "0 12px 30px rgba(243,107,33,0.28)" }}
            >
              Book Garden Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
