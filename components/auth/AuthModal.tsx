"use client";

import { useState } from "react";
import { X, Leaf, Mail, ArrowRight, CheckCircle } from "lucide-react";

interface AuthModalProps {
  onClose?: () => void;
}

type Step = "idle" | "sending" | "sent" | "error";

export function AuthModal({ onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [emailStep, setEmailStep] = useState<Step>("idle");
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");

  async function signInWithGoogle() {
    setAuthLoading(true);
    setError("");
    try {
      const { getAuth, signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
      const { getFirebaseApp } = await import("@/lib/firebase/app");
      const auth = getAuth(getFirebaseApp());
      await signInWithPopup(auth, new GoogleAuthProvider());
      onClose?.();
    } catch (e: unknown) {
      const code = (e as { code?: string }).code;
      if (code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setAuthLoading(false);
    }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailStep("sending");
    setError("");
    try {
      const { getAuth, sendSignInLinkToEmail } = await import("firebase/auth");
      const { getFirebaseApp } = await import("@/lib/firebase/app");
      const auth = getAuth(getFirebaseApp());
      const actionCodeSettings = {
        url: `${window.location.origin}/profile`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email.trim(), actionCodeSettings);
      localStorage.setItem("afixz_store_email_for_signin", email.trim());
      setEmailStep("sent");
    } catch {
      setEmailStep("error");
      setError("Could not send link. Check your email and try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-[#0d1117] px-8 pt-8 pb-10">
          {/* Dot texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="pointer-events-none absolute top-0 left-0 w-40 h-40 rounded-full bg-[#f36b21]/10 blur-2xl" />

          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="relative z-10 flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#f36b21]/20 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[#f36b21]" />
            </div>
            <span className="font-heading font-bold text-white text-[15px]">AfixZ Store</span>
          </div>

          <h2 className="font-heading text-white font-bold text-2xl mb-1 relative z-10">
            Welcome back
          </h2>
          <p className="text-white/50 text-sm relative z-10">
            Sign in to track orders, manage addresses and more.
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          {/* Google */}
          <button
            onClick={signInWithGoogle}
            disabled={authLoading}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#1f2933] hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
            </svg>
            {authLoading ? "Signing in…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Email magic link */}
          {emailStep === "sent" ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="font-heading font-semibold text-[#1f2933] mb-1">Check your inbox</p>
              <p className="text-sm text-slate-500">
                We sent a sign-in link to{" "}
                <span className="font-medium text-[#1f2933]">{email}</span>.
                Click the link to sign in.
              </p>
              <button
                onClick={() => { setEmailStep("idle"); setEmail(""); }}
                className="mt-4 text-xs text-slate-400 hover:text-[#f36b21] transition-colors"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={sendMagicLink} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f36b21]/30 focus:border-[#f36b21]/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={emailStep === "sending"}
                className="w-full flex items-center justify-center gap-2 bg-[#1f2933] hover:bg-[#323f4b] disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-3 text-sm transition-colors group"
              >
                {emailStep === "sending" ? "Sending…" : "Send Magic Link"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}

          {error && (
            <p className="mt-3 text-xs text-red-500 text-center">{error}</p>
          )}

          <p className="mt-6 text-center text-xs text-slate-400">
            By signing in you agree to our{" "}
            <a href="/terms" className="text-[#f36b21] hover:underline">Terms</a>{" "}
            &amp;{" "}
            <a href="/privacy" className="text-[#f36b21] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
