import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { notFound } from "next/navigation";

// IMPORTACIONES CORREGIDAS (Buscan en la raíz subiendo 3 niveles)
import { getProducts } from "../../../services/api";
import { products as localProducts } from "../../../data/products";
import BackButton from "../../../components/BackButton";

const dbNames: Record<string, string> = {
  "plata-925": "Plata 925",
  "oro-18kl": "Oro 18kl",
  "enchapado": "Enchapado",
  "insumos": "Insumos",
  "personalizados": "Personalizados",
  "anillos": "Anillos",
  "aros": "Aros",
  "cadenas": "Cadenas",
  "pulseras": "Pulseras",
  "dijes": "Dijes",
  "conjuntos": "Conjuntos",
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const realName = dbNames[slug] || slug.replace("-", " ");
  const title = realName.toUpperCase();

  // 1. Intentar Backend
  let products = await getProducts({ category: realName });

  if (!products || products.length === 0) {
    products = await getProducts({ type: realName });
  }

  // 2. Fallback Local
  if (!products || products.length === 0) {
    console.log(`⚠️ Usando local para: ${slug}`);
    products = localProducts.filter((p) => 
      p.category === slug || p.material === slug
    ) as any;
  }

  // 3. Normalizar
  const normalizedProducts = products!.map((p: any) => ({
      id: p.id,
      name: p.name,
      image: p.imageUrl || p.image || "/placeholder.jpg", 
      price: p.price,
      formattedPrice: p.formattedPrice || `$${Number(p.price).toLocaleString("es-AR")}`,
      rating: p.rating || 5 
  }));

  return (
    <main className="min-h-screen bg-white pt-10 pb-20">
      <div className="container mx-auto px-4">
        
        <div className="mb-4">
            <BackButton />
        </div>
        
        <div className="text-center mb-16">
          <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mb-2">Colección</p>
          <h1 className="font-serif text-4xl md:text-5xl text-magnolia-dark">{title}</h1>
          <div className="w-16 h-0.5 bg-magnolia-lilac mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {normalizedProducts.map((product) => (
            <Link key={product.id} href={`/producto/${product.id}`} className="group cursor-pointer">
              
              <div className="relative aspect-square w-full mb-4 overflow-hidden bg-gray-50 rounded-sm">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-serif text-gray-800 text-lg group-hover:text-magnolia-lilac transition-colors line-clamp-1">
                  {product.name}
                </h3>
                
                <div className="flex justify-center gap-1 text-yellow-400 text-[10px] mb-1">
                   {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill="currentColor" />
                   ))}
                </div>

                <p className="font-sans text-gray-500 font-light tracking-wide text-sm">
                  {product.formattedPrice}
                </p>
              </div>

            </Link>
          ))}
        </div>
        
        {normalizedProducts.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                <p>No se encontraron productos.</p>
            </div>
        )}

      </div>
    </main>
  );
}