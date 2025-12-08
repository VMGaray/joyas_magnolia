import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import QuoteBanner from "@/components/QuoteBanner";
import FeaturedProducts from "@/components/FeaturedProducts"; // <--- Importar

export default function Home() {
  return (
    <main className="min-h-screen bg-magnolia-light">
      <Hero />
      <CategoryGrid />
      <QuoteBanner />
      <FeaturedProducts /> {/* <--- Agregar acá */}
    </main>
  );
}