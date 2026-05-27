import { getFirebaseApp } from "./app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import type { UserProfile, SavedAddress } from "@/types/user";
import type { ProductOrder } from "@/types/product";
import type { Timestamp } from "firebase/firestore";

function db() {
  return getFirestore(getFirebaseApp());
}

function normalizeProfile(uid: string, raw: Record<string, unknown>): UserProfile {
  return {
    uid,
    displayName: raw.displayName ? String(raw.displayName) : null,
    email: raw.email ? String(raw.email) : null,
    phone: raw.phone ? String(raw.phone) : null,
    photoURL: raw.photoURL ? String(raw.photoURL) : null,
    provider: (raw.provider as UserProfile["provider"]) ?? null,
    role: (raw.role as UserProfile["role"]) ?? "user",
    selectedLocation: raw.selectedLocation ? String(raw.selectedLocation) : null,
    createdAt: raw.createdAt as Timestamp | undefined,
    updatedAt: raw.updatedAt as Timestamp | undefined,
  };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db(), "users", uid));
  if (!snap.exists()) return null;
  return normalizeProfile(uid, snap.data() as Record<string, unknown>);
}

export async function ensureUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<UserProfile> {
  const ref = doc(db(), "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const profile = {
      uid,
      displayName: data.displayName ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      photoURL: data.photoURL ?? null,
      provider: data.provider ?? null,
      role: "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, profile);
    return normalizeProfile(uid, profile as Record<string, unknown>);
  }

  const existing = snap.data() as Record<string, unknown>;
  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (data.displayName && !existing.displayName) updates.displayName = data.displayName;
  if (data.email && !existing.email) updates.email = data.email;
  if (data.photoURL && !existing.photoURL) updates.photoURL = data.photoURL;
  if (data.provider && !existing.provider) updates.provider = data.provider;

  if (Object.keys(updates).length > 1) await updateDoc(ref, updates);

  return normalizeProfile(uid, { ...existing, ...updates });
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<UserProfile, "displayName" | "phone" | "photoURL">>
): Promise<void> {
  await updateDoc(doc(db(), "users", uid), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/* ── Addresses ── */

export async function getAddresses(uid: string): Promise<SavedAddress[]> {
  const snap = await getDocs(collection(db(), "users", uid, "addresses"));
  return snap.docs.map((d) => {
    const raw = d.data() as Record<string, unknown>;
    return {
      id: d.id,
      label: String(raw.label || "home"),
      fullName: String(raw.fullName || raw.name || ""),
      phone: String(raw.phone || ""),
      line1: String(raw.line1 || raw.houseNo || ""),
      line2: raw.line2 ? String(raw.line2) : undefined,
      city: String(raw.city || ""),
      state: raw.state ? String(raw.state) : undefined,
      pincode: String(raw.pincode || ""),
      landmark: raw.landmark ? String(raw.landmark) : undefined,
      fullAddress: String(raw.fullAddress || ""),
      isDefault: Boolean(raw.isDefault),
    };
  });
}

export async function addAddress(
  uid: string,
  address: Omit<SavedAddress, "id">
): Promise<string> {
  const ref = await addDoc(collection(db(), "users", uid, "addresses"), address);
  return ref.id;
}

export async function deleteAddress(uid: string, addressId: string): Promise<void> {
  await deleteDoc(doc(db(), "users", uid, "addresses", addressId));
}

/* ── Product Orders ── */

export async function getUserOrders(uid: string): Promise<ProductOrder[]> {
  const snap = await getDocs(
    query(
      collection(db(), "productOrders"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc"),
      limit(20)
    )
  );
  return snap.docs.map((d) => {
    const raw = d.data() as Record<string, unknown>;
    return {
      id: d.id,
      userId: String(raw.userId),
      items: (raw.items as ProductOrder["items"]) ?? [],
      subtotal: Number(raw.subtotal) || 0,
      shippingCost: Number(raw.shippingCost) || 0,
      total: Number(raw.total) || 0,
      paymentMethod: "COD",
      status: (raw.status as ProductOrder["status"]) ?? "pending",
      shippingAddress: (raw.shippingAddress as ProductOrder["shippingAddress"]) ?? {
        name: "", phone: "", houseNo: "", area: "", city: "", pincode: "", fullAddress: "",
      },
      notes: raw.notes ? String(raw.notes) : undefined,
      createdAt: raw.createdAt as Timestamp | undefined,
      updatedAt: raw.updatedAt as Timestamp | undefined,
    };
  });
}
