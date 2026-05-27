import { Hero } from "@/components/sections/Hero";
import { AllClientSections } from "@/components/sections/AllClientSections";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "AfixZ Store — Plants, Compost & Pots",
  description:
    "Shop premium plants, organic vermicompost and beautiful pots delivered across Delhi NCR.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <Hero />
        <AllClientSections />
      </main>
      <Footer />
    </>
  );
}
