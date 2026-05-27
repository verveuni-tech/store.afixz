"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Home,
  Briefcase,
  MapPin,
} from "lucide-react";

import {
  getAddresses,
  addAddress,
  deleteAddress,
} from "@/lib/firebase/user";

import { serverTimestamp } from "firebase/firestore";

import type { SavedAddress } from "@/types/user";

const LABEL_ICONS: Record<string, React.ReactNode> = {
  home: <Home className="w-4 h-4" />,
  work: <Briefcase className="w-4 h-4" />,
  other: <MapPin className="w-4 h-4" />,
};

const EMPTY_FORM = {
  label: "home",

  fullName: "",
  phone: "",

  houseNo: "",
  area: "",

  landmark: "",

  city: "",
  state: "Delhi",

  pincode: "",

  isDefault: false,
};

export default function AddressesTab({
  uid,
}: {
  uid: string;
}) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  async function loadAddresses() {
    const data = await getAddresses(uid);

    setAddresses(data);
  }

  useEffect(() => {
    loadAddresses().finally(() => setLoading(false));
  }, [uid]);

  function updateForm(
    key: keyof typeof EMPTY_FORM,
    val: string | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: val,
    }));
  }

  function buildFullAddress(f: typeof form) {
    return [
      f.houseNo,
      f.area,
      f.landmark,
      f.city,
      f.state,
      f.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    try {
      const entry: Omit<SavedAddress, "id"> = {
        fullName: form.fullName.trim(),

        phone: form.phone.trim(),

        line1: `${form.houseNo}, ${form.area}`.trim(),

        city: form.city.trim(),

        state: form.state.trim(),

        pincode: form.pincode.trim(),

        landmark: form.landmark.trim(),

        label: form.label,

        isDefault: form.isDefault,

        fullAddress: buildFullAddress(form),

        createdAt: serverTimestamp(),
      };

      await addAddress(uid, entry);

      await loadAddresses();

      setShowForm(false);

      setForm(EMPTY_FORM);
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);

    try {
      await deleteAddress(uid, id);

      setAddresses((prev) =>
        prev.filter((a) => a.id !== id)
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-32 rounded skeleton" />

        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-slate-100 space-y-2"
          >
            <div className="h-4 w-24 rounded skeleton" />
            <div className="h-3 w-64 rounded skeleton" />
            <div className="h-3 w-40 rounded skeleton" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg text-[#1f2933]">
          Saved Addresses
        </h2>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm font-medium bg-[#1f2933] text-white px-4 py-2 rounded-full hover:bg-[#323f4b] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Address
          </button>
        )}
      </div>

      {/* Empty */}
      {addresses.length === 0 && !showForm && (
        <div className="text-center py-14 bg-white rounded-2xl border border-slate-100">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />

          <p className="text-sm font-medium text-slate-500">
            No saved addresses yet
          </p>
        </div>
      )}

      {/* Address List */}
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-start gap-4"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f36b21]/10 flex items-center justify-center text-[#f36b21] flex-shrink-0 mt-0.5">
            {
              LABEL_ICONS[
                (addr.label || "other").toLowerCase()
              ]
            }
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-[#f36b21] uppercase tracking-wide">
                {addr.label}
              </span>

              {addr.isDefault && (
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-medium">
                  Default
                </span>
              )}
            </div>

            <p className="text-sm font-medium text-[#1f2933]">
              {addr.fullName}
            </p>

            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {addr.fullAddress}
            </p>

            {addr.phone && (
              <p className="text-xs text-slate-400 mt-1">
                {addr.phone}
              </p>
            )}
          </div>

          <button
            onClick={() => handleDelete(addr.id!)}
            disabled={deletingId === addr.id}
            className="text-slate-300 hover:text-red-400 transition-colors disabled:opacity-40"
            aria-label="Delete address"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <p className="font-heading font-semibold text-[#1f2933]">
              New Address
            </p>
          </div>

          <form
            onSubmit={handleAdd}
            className="px-5 py-5 space-y-4"
          >
            {/* Label */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">
                Label
              </label>

              <div className="flex gap-2">
                {["home", "work", "other"].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() =>
                      updateForm("label", l)
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                      form.label === l
                        ? "border-[#f36b21] bg-[#f36b21]/5 text-[#f36b21]"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {LABEL_ICONS[l]}
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Full Name"
                value={form.fullName}
                onChange={(v) =>
                  updateForm("fullName", v)
                }
                required
                placeholder="John Doe"
              />

              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) =>
                  updateForm("phone", v)
                }
                required
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="House / Flat No."
                value={form.houseNo}
                onChange={(v) =>
                  updateForm("houseNo", v)
                }
                required
                placeholder="B-42"
              />

              <Field
                label="Area / Colony"
                value={form.area}
                onChange={(v) =>
                  updateForm("area", v)
                }
                required
                placeholder="Sector 15"
              />
            </div>

            <Field
              label="Landmark"
              value={form.landmark}
              onChange={(v) =>
                updateForm("landmark", v)
              }
              placeholder="Near metro station"
            />

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="City"
                value={form.city}
                onChange={(v) =>
                  updateForm("city", v)
                }
                required
                placeholder="Delhi"
              />

              <Field
                label="Pincode"
                value={form.pincode}
                onChange={(v) =>
                  updateForm("pincode", v)
                }
                required
                placeholder="110001"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-50">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);

                  setForm(EMPTY_FORM);
                }}
                className="text-sm font-medium text-slate-500 hover:text-[#1f2933] px-4 py-2 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-[#1f2933] hover:bg-[#323f4b] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
              >
                {saving ? "Saving…" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1f2933] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21]/30 focus:border-[#f36b21]/50 transition-all"
      />
    </div>
  );
}