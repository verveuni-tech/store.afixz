import type { Metadata } from "next";
import { CategoryClient } from "./CategoryClient";

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  plants: {
    title: "Plants",
    description: "Shop indoor & outdoor plants delivered across Delhi NCR. Snake plants, money plants, peace lily and more.",
  },
  compost: {
    title: "Compost & Organic Khad",
    description: "Premium vermicompost, organic fertilizers and nutrient mixes for healthy gardens.",
  },
  pots: {
    title: "Pots & Planters",
    description: "Ceramic, terracotta and self-watering pots for every plant and space.",
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category] ?? {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    description: `Shop ${category} at AfixZ Store.`,
  };
  return { title: meta.title, description: meta.description };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  return <CategoryClient categorySlug={category} />;
}
