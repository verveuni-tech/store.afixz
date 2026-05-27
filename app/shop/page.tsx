import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse all plants, compost and pots at AfixZ Store.",
};

// /shop redirects to plants as the default category
export default function ShopPage() {
  redirect("/shop/plants");
}
