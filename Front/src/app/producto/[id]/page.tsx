
import Image from "next/image";
import Link from "next/link";
import { products } from "../../../data/products";
import { ChevronRight, Star } from "lucide-react"; // Sacamos Heart y ShoppingCart de acá
import { notFound } from "next/navigation";
import AddToCartButton from "../../../components/AddToCartButton";
import WishlistButton from "../../../components/WishlistButton"; // <--- IMPORTAMOS CORAZÓN
import BackButton from "../../../components/BackButton";         // <--- IMPORTAMOS VOLVER

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params;
  const product = products.find((p) => p.id.toString() === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pt-10 pb-20">
      <div className="container mx-auto px-4">
        
        {/* BOTÓN VOLVER (Agregado aquí arriba) */}
        <BackButton />

        {/* Miga de pan */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-magnolia-dark">Home</Link>
          <ChevronRight size={12} />
          <span className="text-magnolia-dark font-bold">{product.category}</span>
          <ChevronRight size={12} />
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          
          {/* FOTOS */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full bg-gray-50 overflow-hidden rounded-sm border border-gray-100">
               <Image 
                 src={product.image} 
                 alt={product.name}
                 fill
                 className="object-cover"
                 priority
               />
            </div>
            <div className="grid grid-cols-4 gap-4">
                {product.images?.map((img, i) => (
                    <div key={i} className="aspect-square bg-gray-50 cursor-pointer border border-transparent hover:border-magnolia-lilac relative">
                        <Image src={img} alt="Thumb" fill className="object-cover"/>
                    </div>
                ))}
            </div>
          </div>

          {/* INFO */}
          <div className="flex flex-col justify-start pt-4">
            
            <h1 className="font-serif text-3xl md:text-4xl text-magnolia-dark mb-2">
                {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-light text-gray-800">{product.formattedPrice}</span>
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < product.rating ? "currentColor" : "none"} />
                    ))}
                </div>
            </div>

            <p className="font-sans text-gray-500 leading-relaxed mb-8 text-sm md:text-base">
                {product.description}
            </p>

            <div className="w-full h-px bg-gray-100 mb-8"></div>

            <div className="flex flex-col gap-4">
                
                {/* BOTONES DE ACCIÓN */}
                <div className="flex gap-4">
                    {/* Botón de Carrito (Ya lo tenías) */}
                    <AddToCartButton product={product} /> 
                    
                    {/* Botón de Favoritos (Nuevo componente) */}
                    <WishlistButton product={product} />
                </div>

                <p className="text-xs text-gray-400 text-center mt-2">
                    🔒 Compra asegurada con Mercado Pago
                </p>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}