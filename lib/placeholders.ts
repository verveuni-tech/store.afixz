import type { Product } from "@/types/product";

export const PLACEHOLDER_PLANTS: Product[] = [
  {
    id: "ph-plant-1", name: "Snake Plant", slug: "ph-plant-1",
    categoryId: "plants", shortDescription: "Low maintenance indoor air purifier",
    description: "", images: [], price: 299, compareAtPrice: 399,
    stock: 20, inStock: true, featured: true, bestseller: true, rating: 4.8,
  },
  {
    id: "ph-plant-2", name: "Money Plant", slug: "ph-plant-2",
    categoryId: "plants", shortDescription: "Lucky charm for your home",
    description: "", images: [], price: 199, compareAtPrice: 249,
    stock: 30, inStock: true, featured: true, bestseller: false, rating: 4.7,
  },
  {
    id: "ph-plant-3", name: "Peace Lily", slug: "ph-plant-3",
    categoryId: "plants", shortDescription: "Elegant white blooms, easy care",
    description: "", images: [], price: 349, compareAtPrice: 449,
    stock: 15, inStock: true, featured: false, bestseller: true, rating: 4.9,
  },
  {
    id: "ph-plant-4", name: "Aloe Vera", slug: "ph-plant-4",
    categoryId: "plants", shortDescription: "Medicinal succulent for sunny spots",
    description: "", images: [], price: 249, compareAtPrice: undefined,
    stock: 25, inStock: true, featured: true, bestseller: false, rating: 4.6,
  },
];

export const PLACEHOLDER_COMPOST: Product[] = [
  {
    id: "ph-comp-1", name: "Vermicompost 5kg", slug: "ph-comp-1",
    categoryId: "compost", shortDescription: "Premium earthworm compost for all plants",
    description: "", images: [], price: 449, compareAtPrice: 549,
    stock: 50, inStock: true, featured: true, bestseller: true, rating: 4.9,
  },
  {
    id: "ph-comp-2", name: "Premium Compost 10kg", slug: "ph-comp-2",
    categoryId: "compost", shortDescription: "Bulk pack for garden beds & pots",
    description: "", images: [], price: 799, compareAtPrice: 999,
    stock: 40, inStock: true, featured: false, bestseller: true, rating: 4.8,
  },
  {
    id: "ph-comp-3", name: "Nutrient Mix 2kg", slug: "ph-comp-3",
    categoryId: "compost", shortDescription: "Concentrated formula for faster growth",
    description: "", images: [], price: 249, compareAtPrice: 299,
    stock: 60, inStock: true, featured: true, bestseller: false, rating: 4.7,
  },
  {
    id: "ph-comp-4", name: "Organic Garden Soil 5kg", slug: "ph-comp-4",
    categoryId: "compost", shortDescription: "Rich loamy soil blend with compost",
    description: "", images: [], price: 349, compareAtPrice: undefined,
    stock: 35, inStock: true, featured: false, bestseller: true, rating: 4.6,
  },
];

export const PLACEHOLDER_POTS: Product[] = [
  {
    id: "ph-pot-1", name: "Ceramic Round Pot", slug: "ph-pot-1",
    categoryId: "pots", shortDescription: "Handcrafted 8-inch ceramic planter",
    description: "", images: [], price: 599, compareAtPrice: 799,
    stock: 20, inStock: true, featured: true, bestseller: true, rating: 4.8,
  },
  {
    id: "ph-pot-2", name: "Hanging Planter Set", slug: "ph-pot-2",
    categoryId: "pots", shortDescription: "Set of 3 macramé hanging planters",
    description: "", images: [], price: 449, compareAtPrice: 599,
    stock: 15, inStock: true, featured: true, bestseller: false, rating: 4.7,
  },
  {
    id: "ph-pot-3", name: "Terracotta Pot Set", slug: "ph-pot-3",
    categoryId: "pots", shortDescription: "Classic terracotta, set of 5 sizes",
    description: "", images: [], price: 699, compareAtPrice: undefined,
    stock: 25, inStock: true, featured: false, bestseller: true, rating: 4.9,
  },
  {
    id: "ph-pot-4", name: "Self-Watering Pot", slug: "ph-pot-4",
    categoryId: "pots", shortDescription: "12-inch reservoir system, reduces watering",
    description: "", images: [], price: 849, compareAtPrice: 1099,
    stock: 10, inStock: true, featured: true, bestseller: false, rating: 4.8,
  },
];
