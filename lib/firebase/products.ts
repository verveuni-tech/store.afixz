"use client";

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  type Timestamp,
} from "firebase/firestore";
import type { Product, ProductCategory } from "@/types/product";

function getDb() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getFirestore(app);
}

function normalizeProduct(id: string, raw: Record<string, unknown>): Product {
  return {
    id,
    name: String(raw.name || "Untitled").trim(),
    slug: String(raw.slug || id).trim(),
    categoryId: String(raw.categoryId || "").trim(),
    categorySlug: raw.categorySlug ? String(raw.categorySlug) : undefined,
    shortDescription: String(raw.shortDescription || "").trim(),
    description: String(raw.description || "").trim(),
    images: Array.isArray(raw.images) ? (raw.images as string[]).filter(Boolean) : [],
    price: typeof raw.price === "number" ? raw.price : Number(raw.price) || 0,
    compareAtPrice:
      typeof raw.compareAtPrice === "number" ? raw.compareAtPrice : undefined,
    stock: typeof raw.stock === "number" ? raw.stock : Number(raw.stock) || 0,
    inStock: Boolean(raw.inStock ?? (raw.stock as number) > 0),
    featured: Boolean(raw.featured),
    bestseller: Boolean(raw.bestseller),
    rating: typeof raw.rating === "number" ? raw.rating : undefined,
    reviewCount: typeof raw.reviewCount === "number" ? raw.reviewCount : undefined,
    searchKeywords: Array.isArray(raw.searchKeywords)
      ? (raw.searchKeywords as string[])
      : [],
    aboutThisItem: Array.isArray(raw.aboutThisItem)
      ? (raw.aboutThisItem as string[])
      : [],
    specifications: Array.isArray(raw.specifications)
      ? (raw.specifications as Array<{ label: string; value: string }>)
      : [],
    availableLocations: Array.isArray(raw.availableLocations)
      ? (raw.availableLocations as string[])
      : [],
    priceByLocation: (raw.priceByLocation as Record<string, number>) ?? {},
    contentByLocation: (raw.contentByLocation as Record<string, Record<string, unknown>>) ?? {},
    seo: raw.seo as Product["seo"] | undefined,
    createdAt: raw.createdAt as Timestamp | undefined,
    updatedAt: raw.updatedAt as Timestamp | undefined,
  };
}

function normalizeCategory(id: string, raw: Record<string, unknown>): ProductCategory {
  return {
    id,
    name: String(raw.name || "Category").trim(),
    slug: String(raw.slug || id).trim(),
    description: raw.description ? String(raw.description) : undefined,
    image: raw.image ? String(raw.image) : undefined,
    banner: raw.banner ? String(raw.banner) : undefined,
    productCount: typeof raw.productCount === "number" ? raw.productCount : 0,
    featured: Boolean(raw.featured),
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : 99,
    createdAt: raw.createdAt as Timestamp | undefined,
  };
}

/* ─── Cache ─── */
const CACHE_TTL = 5 * 60 * 1000;
type CacheEntry<T> = { data: T; timestamp: number };
let productsCache: CacheEntry<Product[]> | null = null;
let categoriesCache: CacheEntry<ProductCategory[]> | null = null;
let productsFetchPromise: Promise<Product[]> | null = null;
let categoriesFetchPromise: Promise<ProductCategory[]> | null = null;

function isFresh<T>(entry: CacheEntry<T> | null): entry is CacheEntry<T> {
  return entry !== null && Date.now() - entry.timestamp < CACHE_TTL;
}

export function invalidateProductsCache() {
  productsCache = null;
  categoriesCache = null;
}

/* ─── Fetchers ─── */

export async function getAllProducts(): Promise<Product[]> {
  if (isFresh(productsCache)) return productsCache.data;
  if (productsFetchPromise) return productsFetchPromise;

  productsFetchPromise = (async () => {
    const db = getDb();
    const snap = await getDocs(
      query(collection(db, "products"), orderBy("createdAt", "desc"))
    );
    const products = snap.docs.map((d) =>
      normalizeProduct(d.id, d.data() as Record<string, unknown>)
    );
    productsCache = { data: products, timestamp: Date.now() };
    productsFetchPromise = null;
    return products;
  })();

  return productsFetchPromise;
}

export async function getFeaturedProducts(count = 8): Promise<Product[]> {
  const db = getDb();
  const snap = await getDocs(
    query(
      collection(db, "products"),
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
      limit(count)
    )
  );
  return snap.docs.map((d) =>
    normalizeProduct(d.id, d.data() as Record<string, unknown>)
  );
}

export async function getBestsellerProducts(count = 8): Promise<Product[]> {
  const db = getDb();
  const snap = await getDocs(
    query(
      collection(db, "products"),
      where("bestseller", "==", true),
      orderBy("createdAt", "desc"),
      limit(count)
    )
  );
  return snap.docs.map((d) =>
    normalizeProduct(d.id, d.data() as Record<string, unknown>)
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDb();
  const snap = await getDocs(
    query(collection(db, "products"), where("slug", "==", slug), limit(1))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return normalizeProduct(d.id, d.data() as Record<string, unknown>);
}

export async function getProductsByCategory(
  categorySlug: string,
  count = 20
): Promise<Product[]> {
  const db = getDb();
  const snap = await getDocs(
    query(
      collection(db, "products"),
      where("categorySlug", "==", categorySlug),
      orderBy("createdAt", "desc"),
      limit(count)
    )
  );
  return snap.docs.map((d) =>
    normalizeProduct(d.id, d.data() as Record<string, unknown>)
  );
}

export async function getAllCategories(): Promise<ProductCategory[]> {
  if (isFresh(categoriesCache)) return categoriesCache.data;
  if (categoriesFetchPromise) return categoriesFetchPromise;

  categoriesFetchPromise = (async () => {
    const db = getDb();
    const snap = await getDocs(
      query(collection(db, "productCategories"), orderBy("sortOrder", "asc"))
    );
    const cats = snap.docs.map((d) =>
      normalizeCategory(d.id, d.data() as Record<string, unknown>)
    );
    categoriesCache = { data: cats, timestamp: Date.now() };
    categoriesFetchPromise = null;
    return cats;
  })();

  return categoriesFetchPromise;
}
