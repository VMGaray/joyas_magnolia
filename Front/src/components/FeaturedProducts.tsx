
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Loader2, Sparkles, Star } from "lucide-react";
import { adaptBackendProducts } from "@/lib/adapters";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // 1. Intentamos cargar por etiqueta "destacado"
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/tags/destacado`);
        
        // 2. Si falla o viene vacío, cargamos todos los productos para no dejar la Home vacía
        if (!res.ok) {
           res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        }
        
        const data = await res.json();
        
        // 3. Adaptamos y tomamos solo los primeros 5 para la vitrina
        const adapted = adaptBackendProducts(data);
        setProducts(adapted.slice(0, 5));
      } catch (err) {
        console.error("Error crítico al cargar destacados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return (
    <div className="py-24 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-magnolia-lilac" size={40} />
      <p className="font-serif italic text-gray-400 animate-pulse uppercase tracking-widest text-[10px]">Preparando Vitrina Magnolia...</p>
    </div>
  );

  // Si después de todo no hay productos, no mostramos la sección
  if (products.length === 0) return null;

  return (
    <section id="destacados" className="py-28 bg-gradient-to-b from-white to-[#F9F7FF] overflow-hidden scroll-mt-24">
      <div className="container mx-auto px-4">
        
        {/* Cabecera Premium */}
        <div className="flex flex-col items-center mb-20 text-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-magnolia-lilac"></div>
            <span className="text-magnolia-lilac uppercase tracking-[0.5em] text-[10px] font-black">Exclusividad</span>
            <div className="w-12 h-[1px] bg-magnolia-lilac"></div>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl text-magnolia-dark mb-4 tracking-tighter">Productos Destacados</h2>
          <p className="font-serif italic text-gray-500 text-lg">Piezas seleccionadas para brillar con vos.</p>
        </div>

        {/* Grilla con efecto 3D corregido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/producto/${product.id}`} className="group block [perspective:1000px] relative">
              
              <div className="absolute -inset-1 bg-gradient-to-r from-magnolia-lilac to-magnolia-dark rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative h-[520px] w-full transition-transform duration-[1.2s] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-sm rounded-2xl bg-white">
                
                {/* CARA FRONTAL (Texto siempre derecho) */}
                <div className="absolute inset-0 h-full w-full bg-white [backface-visibility:hidden] flex flex-col rounded-2xl overflow-hidden">
                  <div className="relative flex-grow overflow-hidden bg-[#FDFDFD]">
                    <div className="absolute top-5 right-5 z-10">
                      <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm">
                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                      </div>
                    </div>
                    <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                  </div>
                  
                  <div className="p-6 text-center bg-white flex flex-col justify-center min-h-[160px]">
                    <h3 className="font-serif text-gray-800 text-[16px] mb-2 leading-tight px-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="w-8 h-[1px] bg-magnolia-lilac/30 mx-auto mb-3"></div>
                    <p className="text-magnolia-dark font-black text-sm tracking-widest uppercase">
                      {/* Aquí se aplica el formato corregido que definimos en el adaptador */}
                      {product.formattedPrice}
                    </p>
                  </div>
                </div>

                {/* CARA TRASERA (Texto siempre derecho) */}
                <div className="absolute inset-0 h-full w-full bg-magnolia-dark [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center p-8 text-center border-2 border-magnolia-lilac/20 rounded-2xl overflow-hidden">
                  <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
                    <Sparkles className="text-magnolia-lilac mb-4 mx-auto" size={24} />
                    <h3 className="text-white font-serif text-lg mb-3 leading-tight px-2">{product.name}</h3>
                    <div className="w-10 h-[1px] bg-magnolia-lilac/40 mx-auto mb-4"></div>
                    <p className="text-gray-300 text-[11px] leading-relaxed font-light line-clamp-6 italic">
                      {product.description || "Una expresión única de elegancia y sofisticación de Magnolia Joyas."}
                    </p>
                  </div>
                  <button className="mt-auto flex items-center gap-3 bg-white text-magnolia-dark px-6 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-magnolia-lilac hover:text-white transition-all shadow-lg">
                    <ShoppingBag size={14} /> Ver Detalles
                  </button>
                </div>

              </div>
            </Link>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link href="/catalogo" className="group inline-flex flex-col items-center">
            <span className="text-sm font-bold uppercase tracking-[0.4em] text-magnolia-dark group-hover:text-magnolia-lilac transition-colors">
              Explorar Colección Completa
            </span>
            <div className="w-0 h-[1px] bg-magnolia-lilac group-hover:w-full transition-all duration-500 mt-2"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}