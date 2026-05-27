import Link from "next/link";
import { Leaf, Share2, MessageCircle, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1f2933] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#f36b21]/20 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[#f36b21]" />
              </div>
              <div className="leading-none">
                <span className="font-heading text-[15px] font-bold text-white tracking-tight">
                  afixz
                </span>
                <span className="block text-[9px] font-sans uppercase tracking-[0.18em] text-[#f36b21] font-medium">
                  store
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
              Premium organic gardening supplies — vermicompost, plants, and pots
              delivered to your doorstep across Delhi, Noida & Gurgaon.
            </p>
            <div className="flex items-center gap-3">
              {[Share2, MessageCircle, Globe].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#f36b21]/20 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-[0.12em]">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "All Products", href: "/shop" },
                { label: "Plants", href: "/shop?category=plants" },
                { label: "Vermicompost", href: "/shop?category=compost" },
                { label: "Pots & Planters", href: "/shop?category=pots" },
                { label: "Bestsellers", href: "/shop?filter=bestseller" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-[#f36b21] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-[0.12em]">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "About AfixZ", href: "https://afixz.com/about" },
                { label: "Book Garden Services", href: "https://afixz.com/garden-care" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "My Orders", href: "/orders" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-[#f36b21] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © 2025 AfixZ Store. Part of the AfixZ ecosystem.
          </p>
          <Link
            href="https://afixz.com"
            target="_blank"
            className="text-xs text-[#f36b21]/70 hover:text-[#f36b21] transition-colors"
          >
            Looking for home services? Visit afixz.com →
          </Link>
        </div>
      </div>
    </footer>
  );
}
