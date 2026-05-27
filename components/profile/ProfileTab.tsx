"use client";

import { useEffect, useState } from "react";
import { Check, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/firebase/user";
import type { UserProfile } from "@/types/user";

export default function ProfileTab({ uid }: { uid: string }) {
  const { refreshProfile } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    getUserProfile(uid).then((p) => {
      setProfileData(p);
      setName(p?.displayName ?? "");
      setPhone(p?.phone ?? "");
      setLoading(false);
    });
  }, [uid]);

  async function handleSave() {
    if (!profileData) return;
    setSaving(true);
    try {
      await updateUserProfile(uid, {
        displayName: name.trim() || null,
        phone: phone.trim() || null,
      });
      await refreshProfile();
      const updated = await getUserProfile(uid);
      setProfileData(updated);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-32 rounded skeleton" />
        <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-20 rounded skeleton" />
              <div className="h-10 rounded-xl skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg text-[#1f2933]">Personal Info</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-[#f36b21] hover:bg-[#f36b21]/5 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-50">
          {/* Name */}
          <div className="px-6 py-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1f2933] focus:outline-none focus:ring-2 focus:ring-[#f36b21]/30 focus:border-[#f36b21]/50 transition-all"
              />
            ) : (
              <p className="text-sm font-medium text-[#1f2933]">{profileData?.displayName || "—"}</p>
            )}
          </div>

          {/* Email — always readonly */}
          <div className="px-6 py-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <p className="text-sm font-medium text-[#1f2933]">{profileData?.email || "—"}</p>
            <p className="text-xs text-slate-400 mt-0.5">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div className="px-6 py-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              Phone
            </label>
            {editing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1f2933] focus:outline-none focus:ring-2 focus:ring-[#f36b21]/30 focus:border-[#f36b21]/50 transition-all"
              />
            ) : (
              <p className="text-sm font-medium text-[#1f2933]">{profileData?.phone || "—"}</p>
            )}
          </div>

          {/* Provider */}
          <div className="px-6 py-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              Sign-in Method
            </label>
            <p className="text-sm font-medium text-[#1f2933] capitalize">
              {profileData?.provider === "google.com" ? "Google" : profileData?.provider ?? "Email"}
            </p>
          </div>
        </div>

        {editing && (
          <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setEditing(false);
                setName(profileData?.displayName ?? "");
                setPhone(profileData?.phone ?? "");
              }}
              className="text-sm font-medium text-slate-500 hover:text-[#1f2933] px-4 py-2 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#1f2933] hover:bg-[#323f4b] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
            >
              {saving ? "Saving…" : saved ? <><Check className="w-4 h-4" /> Saved</> : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
