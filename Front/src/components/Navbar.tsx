"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ChevronDown, Heart, User, LayoutDashboard, Sparkles } from "lucide-react";
import { MENU_ITEMS } from "@/data/menuData"; 
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { toggleCart, totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const hasFavorites = wishlistItems.length > 0;
  const pathname = usePathname();
  const router = useRouter();

  const { isLoggedIn, user } = useAuth(); 

  // ✅ Función mejorada para scrollear a destacados
  const handleDestacadosClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Siempre prevenimos la navegación por defecto
    
    if (pathname === "/") {
      // Si ya estamos en home, solo scrolleamos
      scrollToDestacados();
    } else {
      // Si estamos en otra página, navegamos al home y después scrolleamos
      router.push("/");
      // Esperamos a que Next.js termine de navegar
      setTimeout(() => {
        scrollToDestacados();
      }, 100);
    }
  };

  const scrollToDestacados = () => {
    const element = document.getElementById("destacados");
    if (element) {
      const navbarHeight = 120; // Altura aproximada del navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      toggleCart();
    }
  };

  const handleFavoritesClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/favoritos");
    }
  };

  return (
    <header className="w-full bg-white pt-6 pb-0 border-b border-gray-100 relative z-50">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        
        {/* --- BARRA SUPERIOR --- */}
        <div className="w-full relative flex justify-center items-center mb-2 h-16">
          
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <Image 
              src="/logo-flor.jpg" 
              alt="Magnolia Flor"
              width={80}
              height={80}
              className="w-10 md:w-16 object-contain opacity-80" 
            />
          </div>

          <Link href="/" className="text-center group flex flex-col items-center">
            <h1 className="font-serif text-3xl md:text-5xl tracking-widest text-magnolia-dark text-center">
              MAGNOLIA
            </h1>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-400 group-hover:text-magnolia-lilac transition-colors mt-1">
              Joyas
            </span>
          </Link>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3 md:gap-4">
            
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

            {!user?.isAdmin && (
              <>
                <button 
                  onClick={handleFavoritesClick}
                  className="text-gray-700 hover:text-red-400 transition-colors"
                >
                  <Heart 
                    size={24} 
                    strokeWidth={1.5} 
                    fill={hasFavorites && isLoggedIn ? "#F87171" : "none"} 
                    className={hasFavorites && isLoggedIn ? "text-red-400" : "text-gray-700"}
                  />
                </button>

                <button 
                  onClick={handleCartClick} 
                  className="relative text-gray-700 hover:text-magnolia-lilac transition-colors"
                >
                  <ShoppingCart size={24} strokeWidth={1.5} />
                  {totalItems > 0 && isLoggedIn && (
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

            {/* ✅ BOTÓN DE DESTACADOS MEJORADO */}
            <li className="py-4">
              <button 
                onClick={handleDestacadosClick}
                className="flex items-center gap-2 bg-magnolia-lilac/10 text-magnolia-dark px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-black hover:bg-magnolia-dark hover:text-white transition-all shadow-sm group border border-magnolia-lilac/20"
              >
                <Sparkles size={12} className="text-magnolia-lilac group-hover:text-white transition-colors" />
                Destacados
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}