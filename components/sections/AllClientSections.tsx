"use client";

import dynamic from "next/dynamic";
import {
  PLACEHOLDER_PLANTS,
  PLACEHOLDER_COMPOST,
  PLACEHOLDER_POTS,
} from "@/lib/placeholders";

/* ── Skeletons ── */
function CatSkeleton() {
  return (
    <div className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-7 w-64 skeleton rounded mb-6" />
        <div className="grid grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-48 skeleton rounded-[24px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-5 w-56 skeleton rounded mb-2" />
        <div className="h-8 w-64 skeleton rounded mb-10" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
              <div className="aspect-[4/3] skeleton" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-3/4 skeleton rounded" />
                <div className="h-px w-10 skeleton" />
                <div className="flex items-center justify-between">
                  <div className="h-6 w-20 skeleton rounded" />
                  <div className="h-8 w-14 skeleton rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="py-16 sm:py-20 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-5 w-56 skeleton rounded mb-2" />
        <div className="h-8 w-64 skeleton rounded mb-10" />
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 bg-white rounded-[20px] border border-slate-100 p-4">
              <div className="h-32 w-32 skeleton rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-2/3 skeleton rounded" />
                <div className="h-3 w-1/2 skeleton rounded" />
                <div className="flex items-center justify-between mt-4">
                  <div className="h-5 w-20 skeleton rounded" />
                  <div className="h-8 w-14 skeleton rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Dynamic imports with ssr:false (valid inside client component) ── */

const CategorySection = dynamic(
  () => import("./CategorySection").then((m) => m.CategorySection),
  { ssr: false, loading: () => <CatSkeleton /> }
);

const PlantsSection = dynamic(
  () =>
    import("./ProductCategorySection").then((m) => {
      const Comp = m.ProductCategorySection;
      function PlantsSection() {
        return (
          <Comp
            categorySlug="plants"
            displaySubtitle="For balconies, lawns, and indoor green corners."
            displayLabel="Plants"
            title="Indoor & Outdoor Plants"
            ctaLabel="View All Plants"
            ctaHref="/shop?category=plants"
            layout="grid"
            background="white"
            placeholderProducts={PLACEHOLDER_PLANTS}
          />
        );
      }
      return PlantsSection;
    }),
  { ssr: false, loading: () => <GridSkeleton /> }
);

const CompostSection = dynamic(
  () =>
    import("./ProductCategorySection").then((m) => {
      const Comp = m.ProductCategorySection;
      function CompostSection() {
        return (
          <Comp
            categorySlug="compost"
            displaySubtitle="Feed your soil, nourish your garden."
            displayLabel="Organic Compost"
            title="Vermicompost & Organic Khad"
            ctaLabel="View All Compost"
            ctaHref="/shop?category=compost"
            layout="list"
            background="gray"
            placeholderProducts={PLACEHOLDER_COMPOST}
          />
        );
      }
      return CompostSection;
    }),
  { ssr: false, loading: () => <ListSkeleton /> }
);

const PotsSection = dynamic(
  () =>
    import("./ProductCategorySection").then((m) => {
      const Comp = m.ProductCategorySection;
      function PotsSection() {
        return (
          <Comp
            categorySlug="pots"
            displaySubtitle="Style meets function, pot by pot."
            displayLabel="Pots & Planters"
            title="Ceramic Pots & Premium Planters"
            ctaLabel="View All Pots"
            ctaHref="/shop?category=pots"
            layout="grid"
            background="white"
            placeholderProducts={PLACEHOLDER_POTS}
          />
        );
      }
      return PotsSection;
    }),
  { ssr: false, loading: () => <GridSkeleton /> }
);

export function AllClientSections() {
  return (
    <>
      <CategorySection />
      <PlantsSection />
      <CompostSection />
      <PotsSection />
    </>
  );
}
