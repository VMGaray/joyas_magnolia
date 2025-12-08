'use client';

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import { useProducts } from "@/lib/hooks";
import { adaptBackendProducts } from "@/lib/adapters";

export default function FeaturedProducts() {
  const { products: backendProducts, isLoading, isError } = useProducts();

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-magnolia-dark mb-12 text-left">
            Piezas Destacadas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[450px] w-full bg-gray-100 animate-pulse rounded-sm"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-magnolia-dark mb-12 text-left">
            Piezas Destacadas
          </h2>
          <p className="text-center text-red-500">Error al cargar los productos</p>
        </div>
      </section>
    );
  }

  const products = adaptBackendProducts(backendProducts || []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl text-magnolia-dark mb-12 text-left">
          Piezas Destacadas
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-10">
          {products.map((product) => (
            // AHORA ENVOLVEMOS TODO EN UN LINK QUE LLEVA A /producto/ID
            <Link key={product.id} href={`/producto/${product.id}`} className="group relative h-[450px] w-full [perspective:1000px] cursor-pointer block">
              
              <div className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-sm hover:shadow-lg rounded-sm">
                
                {/* CARA FRONTAL */}
                <div className="absolute inset-0 h-full w-full bg-white [backface-visibility:hidden] flex flex-col">
                  <div className="relative flex-grow w-full overflow-hidden bg-gray-50 mb-4">
                    <Image src={product.image} alt={product.name} fill className="object-cover object-center" />
                    <span className="absolute top-2 left-2 bg-white text-[10px] uppercase tracking-widest px-2 py-1 text-gray-500 shadow-sm">New</span>
                  </div>
                  <div className="text-center space-y-2 pb-4 px-2 h-[100px]">
                    <div className="flex justify-center gap-1 text-yellow-500/50">
                       {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < product.rating ? "currentColor" : "none"} className={i < product.rating ? "text-yellow-400" : "text-gray-300"}/>
                       ))}
                    </div>
                    <h3 className="font-serif text-gray-800 text-lg leading-tight">{product.name}</h3>
                    <p className="font-sans text-gray-500 font-light tracking-wide">{product.formattedPrice}</p>
                  </div>
                </div>

                {/* CARA TRASERA */}
                <div className="absolute inset-0 h-full w-full bg-magnolia-light border border-magnolia-lilac/30 p-6 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <h3 className="font-serif text-magnolia-dark text-xl mb-4">{product.name}</h3>
                  <p className="font-sans text-gray-600 text-sm leading-relaxed mb-8 font-light line-clamp-4">{product.description}</p>
                  <button className="flex items-center gap-2 bg-magnolia-dark text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-magnolia-lilac transition-colors shadow-md">
                    <ShoppingBag size={14} />
                    Ver Detalle
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}