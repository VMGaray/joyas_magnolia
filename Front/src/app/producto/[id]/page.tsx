
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";
import AddToCartButton from "../../../components/AddToCartButton";
import WishlistButton from "../../../components/WishlistButton";
import BackButton from "../../../components/BackButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category?: { id: number; name: string } | null;
  productType?: { id: number; name: string } | null;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: "no-store",
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Convertir a formato compatible con los botones
  const formattedProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image: product.imageUrl || "/placeholder.jpg",
    imageUrl: product.imageUrl || "/placeholder.jpg",
    formattedPrice: `$${Number(product.price).toLocaleString("es-AR")}`,
    category: product.category?.name || "Sin categoría",
    rating: 5,
  };

  return (
    <main className="min-h-screen bg-white pt-10 pb-20">
      <div className="container mx-auto px-4">
        
        {/* BOTÓN VOLVER */}
        <BackButton />

        {/* Miga de pan */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-magnolia-dark">Home</Link>
          <ChevronRight size={12} />
          <span className="text-magnolia-dark font-bold">{formattedProduct.category}</span>
          <ChevronRight size={12} />
          <span>{formattedProduct.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          
          {/* IMAGEN PRINCIPAL */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full bg-gray-50 overflow-hidden rounded-sm border border-gray-100">
               <Image 
                 src={formattedProduct.image} 
                 alt={formattedProduct.name}
                 fill
                 className="object-cover"
                 priority
               />
            </div>
          </div>

          {/* INFORMACIÓN DEL PRODUCTO */}
          <div className="flex flex-col justify-start pt-4">
            
            <h1 className="font-serif text-3xl md:text-4xl text-magnolia-dark mb-4">
                {formattedProduct.name}
            </h1>

            {/* Precio y Rating */}
            <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-light text-gray-800">{formattedProduct.formattedPrice}</span>
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                    ))}
                </div>
            </div>

            {/* Stock Info */}
            <div className={`mb-6 p-3 rounded-sm flex items-center gap-2 ${
              formattedProduct.stock > 0 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
            }`}>
              {formattedProduct.stock > 0 ? (
                <>
                  <span className="text-sm font-medium">✓ En stock ({formattedProduct.stock} disponibles)</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">Sin stock - Próximamente</span>
                </>
              )}
            </div>

            {/* Descripción */}
            <p className="font-sans text-gray-600 leading-relaxed mb-8 text-sm md:text-base">
                {formattedProduct.description}
            </p>

            <div className="w-full h-px bg-gray-100 mb-8"></div>

            {/* Botones de Acción */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <AddToCartButton product={formattedProduct} /> 
                    <WishlistButton product={formattedProduct} />
                </div>

                <p className="text-xs text-gray-400 text-center mt-2">
                    🔒 Compra asegurada con Mercado Pago
                </p>
            </div>

            {/* Info adicional */}
            <div className="mt-12 space-y-4 border-t border-gray-100 pt-8">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Categoría:</span>
                <span className="font-medium text-gray-800">{formattedProduct.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Disponibilidad:</span>
                <span className="font-medium text-green-600">
                  {formattedProduct.stock > 0 ? "En stock" : "Agotado"}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}