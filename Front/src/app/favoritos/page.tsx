"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "../../context/WishlistContext";
import { Heart, ShoppingBag } from "lucide-react";
import AddToCartButton from "../../components/AddToCartButton";

export default function FavoritesPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();

  return (
    <main className="min-h-screen bg-white pt-10 pb-20">
      <div className="container mx-auto px-4">
        
        <h1 className="font-serif text-3xl md:text-4xl text-magnolia-dark mb-8 text-center">
          Mis Favoritos
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Heart size={64} className="mb-4 opacity-20" />
            <p className="text-lg">No tenés productos guardados aún.</p>
            <Link href="/" className="mt-6 text-magnolia-dark underline hover:text-magnolia-lilac">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlistItems.map((product) => (
              <div key={product.id} className="group relative border border-gray-100 rounded-sm p-4">
                
                {/* Botón para borrar de favoritos (X) */}
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 z-10 text-gray-400 hover:text-red-500 p-2 bg-white rounded-full shadow-sm"
                >
                  <Heart size={18} fill="currentColor" className="text-red-500" />
                </button>

                {/* Foto y Link */}
                <Link href={`/producto/${product.id}`} className="block relative aspect-square w-full bg-gray-50 overflow-hidden mb-4">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </Link>

                {/* Info */}
                <div className="text-center space-y-2">
                  <h3 className="font-serif text-gray-800 text-lg">{product.name}</h3>
                  <p className="font-sans text-gray-500">${product.price.toLocaleString("es-AR")}</p>
                  
                  {/* Botón Agregar al Carrito Directo */}
                  <div className="pt-2">
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}