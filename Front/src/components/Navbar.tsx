"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ChevronDown, Heart, User, LayoutDashboard, Sparkles } from "lucide-react";
import { MENU_ITEMS } from "@/data/menuData"; 
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { toggleCart, totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const hasFavorites = wishlistItems.length > 0;
  const pathname = usePathname();

  // ✅ Obtenemos el objeto user para chequear isAdmin
  const { isLoggedIn, user } = useAuth(); 

  return (
    <header className="w-full bg-white pt-6 pb-0 border-b border-gray-100 relative z-50">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        
        {/* --- BARRA SUPERIOR --- */}
        <div className="w-full relative flex justify-center items-center mb-2 h-16">
          
          {/* FLOR (Izquierda) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <Image 
              src="/logo-flor.jpg" 
              alt="Magnolia Flor"
              width={80}
              height={80}
              className="w-10 md:w-16 object-contain opacity-80" 
            />
          </div>

          {/* LOGO TEXTO (Centro) */}
          <Link href="/" className="text-center group flex flex-col items-center">
            <h1 className="font-serif text-3xl md:text-5xl tracking-widest text-magnolia-dark">
              MAGNOLIA
            </h1>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-400 group-hover:text-magnolia-lilac transition-colors mt-1">
              Joyas
            </span>
          </Link>

          {/* ICONOS DERECHA */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3 md:gap-4">
            
            {/* --- LÓGICA DE USUARIO / LOGIN --- */}
            {isLoggedIn ? (
              <Link 
                href={user?.isAdmin ? "/admin" : "/perfil"} 
                className="text-magnolia-lilac py-2 flex items-center gap-1" 
                title={user?.isAdmin ? "Panel de Control" : "Mi Perfil"}
              >
                {user?.isAdmin ? <LayoutDashboard size={22} strokeWidth={1.5} /> : <User size={24} strokeWidth={1.5} />}
              </Link>
            ) : (
              <Link 
                href="/login"
                className="text-gray-700 hover:text-magnolia-lilac transition-colors"
                title="Iniciar Sesión"
              >
                <User size={24} strokeWidth={1.5} />
              </Link>
            )}

            {/* ✅ Ocultamos Favoritos y Carrito si el usuario es ADMIN */}
            {!user?.isAdmin && (
              <>
                {/* Favoritos */}
                <Link href="/favoritos" className="text-gray-700 hover:text-red-400 transition-colors">
                  <Heart 
                    size={24} 
                    strokeWidth={1.5} 
                    fill={hasFavorites ? "#F87171" : "none"} 
                    className={hasFavorites ? "text-red-400" : "text-gray-700"}
                  />
                </Link>

                {/* Carrito */}
                <button 
                  onClick={toggleCart} 
                  className="relative text-gray-700 hover:text-magnolia-lilac transition-colors"
                >
                  <ShoppingCart size={24} strokeWidth={1.5} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-magnolia-lilac text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* --- MENÚ DE NAVEGACIÓN --- */}
        <nav className="relative w-full">
          <ul className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm font-sans text-gray-600 font-medium tracking-wide">
            {MENU_ITEMS.map((category) => (
              <li key={category.title} className="group py-4">
                <Link 
                  href={category.href} 
                  className="hover:text-magnolia-lilac transition-colors uppercase text-[10px] md:text-xs flex items-center gap-1"
                >
                  {category.title}
                  {category.sections && category.sections.length > 0 && (
                    <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform"/>
                  )}
                </Link>
              </li>
            ))}

            {/* ✅ LINK DE DESTACADOS (Solo visible si no estás en el panel de admin) */}
            <li className="py-4">
              <Link 
                href="/#destacados" 
                className="flex items-center gap-2 bg-magnolia-lilac/10 text-magnolia-dark px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-black hover:bg-magnolia-dark hover:text-white transition-all shadow-sm group border border-magnolia-lilac/20"
              >
                <Sparkles size={12} className="text-magnolia-lilac group-hover:text-white transition-colors" />
                Destacados
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}