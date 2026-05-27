import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categorySlug?: string;
  shortDescription: string;
  description: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  stock: number;
  inStock: boolean;
  featured: boolean;
  bestseller: boolean;
  rating?: number;
  reviewCount?: number;
  searchKeywords?: string[];
  aboutThisItem?: string[];
  specifications?: Array<{ label: string; value: string }>;
  availableLocations?: string[];
  priceByLocation?: Record<string, number>;
  contentByLocation?: Record<string, Record<string, unknown>>;
  seo?: {
    title: string;
    description: string;
    canonical?: string;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  banner?: string;
  productCount?: number;
  featured?: boolean;
  sortOrder?: number;
  createdAt?: Timestamp;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  stock: number;
}

export interface ProductOrder {
  id?: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: "COD";
  status: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    name: string;
    phone: string;
    houseNo: string;
    area: string;
    landmark?: string;
    city: string;
    pincode: string;
    fullAddress: string;
  };
  notes?: string;
  locationId?: string;
  source?: "store";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
