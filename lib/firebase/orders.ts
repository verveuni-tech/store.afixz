import { getFirebaseApp } from "./app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { CartItem, ProductOrder } from "@/types/product";

function db() {
  return getFirestore(getFirebaseApp());
}

export interface CreateOrderPayload {
  userId: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: ProductOrder["shippingAddress"];
  locationId: string;
  notes?: string;
}

export async function createProductOrder(payload: CreateOrderPayload): Promise<string> {
  // Strip undefined fields — Firestore rejects them
  const address = Object.fromEntries(
    Object.entries(payload.shippingAddress).filter(([, v]) => v !== undefined && v !== "")
  );

  const ref = await addDoc(collection(db(), "productOrders"), {
    source: "store",
    userId: payload.userId,
    items: payload.items,
    subtotal: payload.subtotal,
    shippingCost: payload.shippingCost,
    total: payload.total,
    paymentMethod: "COD",
    status: "pending",
    shippingAddress: address,
    locationId: payload.locationId,
    notes: payload.notes ?? "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}
