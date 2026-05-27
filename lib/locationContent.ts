import type { Product } from "@/types/product";
import type { LocationId } from "@/types/location";

/**
 * Check if a product is available in a given location.
 * Empty availableLocations = available everywhere.
 */
export function isAvailableInLocation(
  product: Product,
  locationId: LocationId
): boolean {
  if (!product.availableLocations || product.availableLocations.length === 0) return true;
  return product.availableLocations.includes(locationId);
}

/**
 * Resolve location-specific price and content overrides.
 * Always returns a product — never filters.
 */
export function resolveProductForLocation(
  product: Product,
  locationId: LocationId
): Product {
  const locationPrice = product.priceByLocation?.[locationId];
  const price = typeof locationPrice === "number" ? locationPrice : product.price;
  const override = product.contentByLocation?.[locationId] ?? {};
  return { ...product, ...(override as Partial<Product>), price };
}

/**
 * Resolve prices for a list of products — no filtering.
 */
export function resolveProductsForLocation(
  products: Product[],
  locationId: LocationId
): Product[] {
  return products.map((p) => resolveProductForLocation(p, locationId));
}
