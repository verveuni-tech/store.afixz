"use client";

import { useState } from "react";
import { MessageCircle, Phone, Send, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "We deliver within 2–5 business days across Delhi NCR. Express delivery (same-day or next-day) is available for select pincodes.",
  },
  {
    q: "Can I return or exchange a plant?",
    a: "Yes — if your plant arrives damaged, contact us within 24 hours with a photo and we'll arrange a replacement or refund.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is shipped, you'll receive a WhatsApp message with tracking details. You can also view status in the Orders tab.",
  },
  {
    q: "Is the vermicompost certified organic?",
    a: "Our vermicompost is produced using controlled organic inputs. Certificate copies are available on request.",
  },
];

export default function SupportTab() {
  const { profile } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim()) return;
    setSending(true);
    // Simulate a WhatsApp pre-fill redirect
    const text = encodeURIComponent(
      `Hi AfixZ Store Support!\n\nName: ${profile?.displayName ?? "Customer"}\nEmail: ${profile?.email ?? ""}\n\nMessage: ${msg.trim()}`
    );
    window.open(`https://wa.me/919999999999?text=${text}`, "_blank");
    setSent(true);
    setMsg("");
    setSending(false);
  }

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-bold text-lg text-[#1f2933]">Help & Support</h2>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-5 py-5 hover:shadow-sm hover:border-emerald-200 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
            <MessageCircle className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="font-heading font-semibold text-[#1f2933] text-sm">WhatsApp</p>
            <p className="text-xs text-slate-500 mt-0.5">Chat with us — typically reply in &lt;1 hr</p>
          </div>
        </a>

        <a
          href="tel:+919999999999"
          className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-5 py-5 hover:shadow-sm hover:border-[#f36b21]/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#f36b21]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#f36b21]/20 transition-colors">
            <Phone className="w-6 h-6 text-[#f36b21]" />
          </div>
          <div>
            <p className="font-heading font-semibold text-[#1f2933] text-sm">Call Us</p>
            <p className="text-xs text-slate-500 mt-0.5">Mon–Sat, 9 am – 7 pm IST</p>
          </div>
        </a>
      </div>

      {/* Quick message */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50">
          <p className="font-heading font-semibold text-[#1f2933]">Send a Message</p>
          <p className="text-xs text-slate-400 mt-0.5">We'll reply via WhatsApp or email</p>
        </div>
        {sent ? (
          <div className="px-5 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <Send className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="font-heading font-semibold text-[#1f2933] mb-1">Message sent via WhatsApp</p>
            <p className="text-sm text-slate-500">We'll get back to you shortly.</p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-xs text-[#f36b21] hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Describe your issue or question…"
              rows={4}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1f2933] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21]/30 focus:border-[#f36b21]/50 transition-all resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 bg-[#1f2933] hover:bg-[#323f4b] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? "Opening WhatsApp…" : "Send via WhatsApp"}
            </button>
          </form>
        )}
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50">
          <p className="font-heading font-semibold text-[#1f2933]">Frequently Asked Questions</p>
        </div>
        <div className="divide-y divide-slate-50">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-medium text-[#1f2933] pr-4">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
