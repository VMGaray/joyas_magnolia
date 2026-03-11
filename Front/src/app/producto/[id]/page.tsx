"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, AlertCircle, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import AddToCartButton from "../../../components/AddToCartButton";
import WishlistButton from "../../../components/WishlistButton";
import BackButton from "../../../components/BackButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// 💰 Función de formateo de precios LIMPIA
function formatPrice(price: number): string {
  return `$${Math.round(Number(price || 0)).toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Desenvolvemos los params usando 'use' de React
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) {
          setProduct(null);
        } else {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-magnolia-lilac" size={40} />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const displayCategory = product.category?.name || product.productType?.name || "Joyas";

  const formattedProduct = {
    ...product,
    id: product.id,
    image: product.imageUrl || "/placeholder.jpg",
    formattedPrice: formatPrice(product.price), // ✅ Sin multiplicar por 1000
    category: displayCategory,
  };

  return (
    <main className="min-h-screen bg-white pt-10 pb-20">
      <div className="container mx-auto px-4">
        <BackButton />

        {/* Miga de pan */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-magnolia-dark">Home</Link>
          <ChevronRight size={12} />
          <span className="text-magnolia-dark font-bold">{formattedProduct.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* IMAGEN */}
          <div className="relative aspect-square w-full bg-gray-50 overflow-hidden rounded-sm border border-gray-100">
             <Image 
               src={formattedProduct.image} 
               alt={formattedProduct.name}
               fill
               className="object-cover"
               priority
             />
          </div>

          {/* INFO */}
          <div className="flex flex-col justify-start pt-4">
            <h1 className="font-serif text-3xl md:text-4xl text-magnolia-dark mb-4">
                {formattedProduct.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-light text-gray-800">{formattedProduct.formattedPrice}</span>
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
            </div>

            <div className={`mb-6 p-3 rounded-sm flex items-center gap-2 ${
              formattedProduct.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              <span className="text-sm font-medium">
                {formattedProduct.stock > 0 ? `✓ En stock (${formattedProduct.stock} disponibles)` : "Sin stock"}
              </span>
            </div>

            <p className="font-sans text-gray-600 leading-relaxed mb-8 text-sm md:text-base italic">
                {formattedProduct.description}
            </p>

            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <AddToCartButton product={formattedProduct} /> 
                    <WishlistButton product={formattedProduct} />
                </div>
                <p className="text-xs text-gray-400 text-center mt-2 italic">
                    🔒 Pago seguro procesado por Mercado Pago
                </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}