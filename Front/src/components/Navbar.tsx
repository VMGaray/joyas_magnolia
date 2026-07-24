"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Heart,
  User,
  LayoutDashboard,
  Sparkles,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import { MENU_ITEMS, MainCategory, MenuSection } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

// Arma el link al catálogo aplicando category (via segmento de ruta), type y subtype (query params)
function buildHref(base: string, type?: string, subtype?: string) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (subtype) params.set("subtype", subtype);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export default function Navbar() {
  const { toggleCart, totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const hasFavorites = wishlistItems.length > 0;
  const pathname = usePathname();
  const router = useRouter();

  const { isLoggedIn, user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpenCategory(null);
    setOpenSection(null);
  };

  // ✅ Función mejorada para scrollear a destacados
  const handleDestacadosClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMobileMenu();

    if (pathname === "/") {
      scrollToDestacados();
    } else {
      router.push("/");
      setTimeout(() => {
        scrollToDestacados();
      }, 100);
    }
  };

  const scrollToDestacados = () => {
    const element = document.getElementById("destacados");
    if (element) {
      const navbarHeight = 120;
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

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="absolute left-0 top-1/2 -translate-y-1/2 md:hidden text-magnolia-dark p-2"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>

          <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2">
            <Image
              src="/logo-flor.jpg"
              alt="Magnolia Flor"
              width={80}
              height={80}
              className="w-10 md:w-16 object-contain opacity-80"
            />
          </div>

          <Link href="/" className="text-center group flex flex-col items-center" onClick={closeMobileMenu}>
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

        {/* --- MENÚ DE NAVEGACIÓN (DESKTOP: mega menu por hover) --- */}
        <nav className="relative w-full hidden md:block">
          <ul className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm font-sans text-gray-600 font-medium tracking-wide">
            {MENU_ITEMS.map((item) => (
              <li key={item.title} className="group py-4">
                <Link
                  href={item.href}
                  className="hover:text-magnolia-lilac transition-colors uppercase text-[10px] md:text-xs flex items-center gap-1"
                >
                  {item.title}
                  {item.sections && item.sections.length > 0 && (
                    <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform"/>
                  )}
                </Link>

                {item.sections && item.sections.length > 0 && (
                  <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 absolute inset-x-0 top-full pt-3 z-50 flex justify-center px-4">
                    <div className="bg-white border border-gray-100 shadow-xl rounded-sm p-6 max-w-4xl">
                      <div className="flex flex-wrap gap-x-10 gap-y-6 justify-center">
                        {item.sections.map((section) => (
                          <div key={section.value} className="min-w-[150px] max-w-[190px]">
                            <Link
                              href={buildHref(item.href, section.value)}
                              className="block text-[11px] font-bold uppercase tracking-wider text-magnolia-dark mb-3 hover:text-magnolia-lilac transition-colors"
                            >
                              {section.label}
                            </Link>
                            {section.subtypes.length > 0 ? (
                              <ul className="space-y-2">
                                {section.subtypes.map((subtype) => (
                                  <li key={subtype.value}>
                                    <Link
                                      href={buildHref(item.href, section.value, subtype.value)}
                                      className="text-xs text-gray-500 hover:text-magnolia-lilac transition-colors"
                                    >
                                      {subtype.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <Link
                                href={buildHref(item.href, section.value)}
                                className="text-xs text-gray-500 hover:text-magnolia-lilac transition-colors"
                              >
                                Ver todo
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}

            {/* ✅ BOTÓN DE DESTACADOS */}
            <li className="py-4">
              <button
                onClick={handleDestacadosClick}
                className="flex items-center gap-2 bg-magnolia-lilac/10 text-magnolia-dark px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-black hover:bg-magnolia-dark hover:text-white transition-all shadow-sm group border border-magnolia-lilac/20"
              >
                <Sparkles size={12} className="text-magnolia-lilac group-hover:text-white transition-colors" />
                Destacados
              </button>
            </li>

            {/* ✅ BOTÓN VENTAS MAYORISTAS (Nuevo) */}
            <li className="py-4">
              <a
                href="https://wa.me/5493546567106?text=Hola!%20Me%20interesa%20obtener%20información%20sobre%20ventas%20mayoristas."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-green-50 hover:text-green-600 border border-gray-200 hover:border-green-200 transition-all shadow-sm group"
              >
                <MessageCircle size={12} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                Ventas Mayoristas
              </a>
            </li>
          </ul>
        </nav>

        {/* --- MENÚ DE NAVEGACIÓN (MOBILE: drawer con acordeón) --- */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-[60] flex">
            <div className="w-[85vw] max-w-sm bg-white h-full overflow-y-auto shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="font-serif text-lg text-magnolia-dark tracking-wide">Menú</span>
                <button onClick={closeMobileMenu} aria-label="Cerrar menú" className="p-1 text-gray-500">
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex-1 p-2">
                <ul className="divide-y divide-gray-100">
                  {MENU_ITEMS.map((item) => (
                    <MobileCategoryItem
                      key={item.title}
                      item={item}
                      isOpen={openCategory === item.title}
                      openSection={openSection}
                      onToggle={() =>
                        setOpenCategory((prev) => (prev === item.title ? null : item.title))
                      }
                      onToggleSection={(sectionValue) =>
                        setOpenSection((prev) => (prev === sectionValue ? null : sectionValue))
                      }
                      onNavigate={closeMobileMenu}
                    />
                  ))}
                </ul>

                <div className="p-4 flex flex-col gap-3">
                  <button
                    onClick={handleDestacadosClick}
                    className="flex items-center gap-2 bg-magnolia-lilac/10 text-magnolia-dark px-4 py-2 rounded-full text-[11px] uppercase tracking-widest font-black w-fit"
                  >
                    <Sparkles size={12} className="text-magnolia-lilac" />
                    Destacados
                  </button>
                  <a
                    href="https://wa.me/5493546567106?text=Hola!%20Me%20interesa%20obtener%20información%20sobre%20ventas%20mayoristas."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold border border-gray-200 w-fit"
                  >
                    <MessageCircle size={12} className="text-gray-400" />
                    Ventas Mayoristas
                  </a>
                </div>
              </nav>
            </div>

            {/* overlay */}
            <div className="flex-1 bg-black/40" onClick={closeMobileMenu} />
          </div>
        )}
      </div>
    </header>
  );
}

function MobileCategoryItem({
  item,
  isOpen,
  openSection,
  onToggle,
  onToggleSection,
  onNavigate,
}: {
  item: MainCategory;
  isOpen: boolean;
  openSection: string | null;
  onToggle: () => void;
  onToggleSection: (sectionValue: string) => void;
  onNavigate: () => void;
}) {
  const hasSections = !!item.sections && item.sections.length > 0;

  return (
    <li>
      <div className="flex items-center justify-between">
        <Link
          href={item.href}
          onClick={onNavigate}
          className="flex-1 py-3 text-sm uppercase tracking-wide text-magnolia-dark font-medium"
        >
          {item.title}
        </Link>
        {hasSections && (
          <button
            onClick={onToggle}
            aria-label={isOpen ? `Cerrar ${item.title}` : `Ver subcategorías de ${item.title}`}
            aria-expanded={isOpen}
            className="p-3 text-gray-400"
          >
            <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {hasSections && isOpen && (
        <ul className="pl-3 pb-3 space-y-1">
          {item.sections!.map((section) => (
            <MobileSectionItem
              key={section.value}
              baseHref={item.href}
              section={section}
              isOpen={openSection === section.value}
              onToggle={() => onToggleSection(section.value)}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function MobileSectionItem({
  baseHref,
  section,
  isOpen,
  onToggle,
  onNavigate,
}: {
  baseHref: string;
  section: MenuSection;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const hasSubtypes = section.subtypes.length > 0;

  return (
    <li className="border-l border-gray-100 pl-2">
      <div className="flex items-center justify-between">
        <Link
          href={buildHref(baseHref, section.value)}
          onClick={onNavigate}
          className="flex-1 py-2 text-xs uppercase tracking-wide text-gray-600 font-medium"
        >
          {section.label}
        </Link>
        {hasSubtypes && (
          <button
            onClick={onToggle}
            aria-label={isOpen ? `Cerrar ${section.label}` : `Ver subcategorías de ${section.label}`}
            aria-expanded={isOpen}
            className="p-2 text-gray-400"
          >
            <ChevronRight size={14} className={`transition-transform ${isOpen ? "rotate-90" : ""}`} />
          </button>
        )}
      </div>

      {hasSubtypes && isOpen && (
        <ul className="pl-3 pb-2 space-y-1">
          {section.subtypes.map((subtype) => (
            <li key={subtype.value}>
              <Link
                href={buildHref(baseHref, section.value, subtype.value)}
                onClick={onNavigate}
                className="block py-1.5 text-xs text-gray-500"
              >
                {subtype.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
