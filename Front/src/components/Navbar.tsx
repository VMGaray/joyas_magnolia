"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ChevronDown, Heart, User, LogOut, Settings } from "lucide-react";
import { MENU_ITEMS } from "@/data/menuData"; 
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { toggleCart, totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const hasFavorites = wishlistItems.length > 0;

  const { isLoggedIn, logout } = useAuth(); 

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
              <div className="relative group h-full flex items-center"> 
                <Link href="/perfil" className="text-magnolia-lilac py-2">
                  <User size={24} strokeWidth={1.5} />
                </Link>

                {/* Menú Flotante */}
                <div className="absolute right-0 top-[80%] pt-6 w-48 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                  <div className="bg-white border border-gray-100 shadow-lg rounded-sm flex flex-col overflow-hidden">
                    
                    <Link 
                      href="/perfil" 
                      className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-magnolia-lilac flex items-center gap-2 transition-colors border-b border-gray-50"
                    >
                      <Settings size={16} />
                      Ir a mi Perfil
                    </Link>

                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/login"
                className="text-gray-700 hover:text-magnolia-lilac transition-colors"
                title="Iniciar Sesión"
              >
                <User size={24} strokeWidth={1.5} />
              </Link>
            )}

            {/* Favoritos */}
            <Link href="/favoritos" className="text-gray-700 hover:text-red-400 transition-colors">
              <Heart 
                size={24} 
                strokeWidth={1.5} 
                fill={hasFavorites ? "#F87171" : "none"} 
                className={hasFavorites ? "text-red-400" : "text-gray-700 group-hover:text-red-400"}
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
          </div>
        </div>

        {/* --- MENÚ DE NAVEGACIÓN (Categorías) --- */}
        <nav className="relative w-full">
          <ul className="flex flex-wrap justify-center gap-8 text-sm font-sans text-gray-600 font-medium tracking-wide">
            {MENU_ITEMS.map((category) => (
              <li key={category.title} className="group py-4">
                <Link 
                  href={category.href} 
                  className="hover:text-magnolia-lilac transition-colors uppercase text-xs md:text-sm flex items-center gap-1"
                >
                  {category.title}
                  {category.sections && category.sections.length > 0 && (
                    <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform"/>
                  )}
                </Link>

                {category.sections && category.sections.length > 0 && (
                  <div className="absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="container mx-auto px-8 py-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {category.sections.map((section) => (
                          <div key={section.title}>
                            <h3 className="font-serif text-magnolia-dark text-lg mb-3 border-b border-gray-100 pb-1">
                              {section.title}
                            </h3>
                            <ul className="flex flex-col gap-2">
                              {section.items.map((item) => (
                                <li key={item.name}>
                                  <Link 
                                    href={item.href}
                                    className="text-gray-500 hover:text-magnolia-lilac text-xs transition-colors block"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
