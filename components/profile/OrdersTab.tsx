"use client";

import { useEffect, useState } from "react";
import { Package, ChevronRight } from "lucide-react";
import type { ProductOrder } from "@/types/product";
import { getUserOrders } from "@/lib/firebase/user";

const STATUS_CONFIG: Record<
  ProductOrder["status"],
  { label: string; bg: string; text: string; dot: string }
> = {
  pending:   { label: "Pending",   bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" },
  confirmed: { label: "Confirmed", bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400" },
  packed:    { label: "Packed",    bg: "bg-indigo-50",  text: "text-indigo-700",  dot: "bg-indigo-400" },
  shipped:   { label: "Shipped",   bg: "bg-cyan-50",    text: "text-cyan-700",    dot: "bg-cyan-400" },
  delivered: { label: "Delivered", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  cancelled: { label: "Cancelled", bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400" },
};

function formatDate(ts: { toDate?: () => Date; seconds?: number } | undefined): string {
  if (!ts) return "";
  const d = typeof ts.toDate === "function" ? ts.toDate() : ts.seconds ? new Date(ts.seconds * 1000) : null;
  if (!d) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrdersTab({ uid }: { uid: string }) {
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrders(uid)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [uid]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-32 rounded skeleton" />
              <div className="h-5 w-20 rounded-full skeleton" />
            </div>
            <div className="h-3 w-48 rounded skeleton" />
            <div className="h-3 w-24 rounded skeleton" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="font-heading font-semibold text-[#1f2933] mb-1">No orders yet</h3>
        <p className="text-sm text-slate-500">Your orders will appear here once you place one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-heading font-bold text-lg text-[#1f2933]">Your Orders</h2>
      {orders.map((order) => {
        const cfg = STATUS_CONFIG[order.status];
        return (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-sm transition-shadow"
          >
            {/* Order header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">
                  Order #{order.id?.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-slate-500">{formatDate(order.createdAt as Parameters<typeof formatDate>[0])}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>

            {/* Items */}
            <div className="px-5 py-3 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-[#1f2933] font-medium truncate max-w-[70%]">
                    {item.name} <span className="text-slate-400 font-normal">× {item.quantity}</span>
                  </span>
                  <span className="text-slate-600">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-slate-500">Total: </span>
                <span className="font-bold text-[#1f2933]">₹{order.total.toLocaleString("en-IN")}</span>
                <span className="ml-2 text-xs text-slate-400">{order.paymentMethod}</span>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-[#f36b21] hover:underline">
                Details <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
