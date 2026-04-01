'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon, // Icono para cerrar sesión
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth(); // ✅ Extraemos loading y logout
  const [open, setOpen] = useState(false);

  // 🛡️ ESCUDO DE SEGURIDAD: Si no es admin, lo expulsamos inmediatamente
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const links = [
    { href: "/admin", label: "Panel de control", icon: HomeIcon },
    { href: "/admin/productos", label: "Productos", icon: CubeIcon },
    { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardDocumentListIcon },
    { href: "/admin/usuarios", label: "Usuarios", icon: UserGroupIcon },
  ];

  // ⏳ ESTADO DE CARGA: Con los colores de tu marca para evitar parpadeos
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-magnolia-lilac border-t-transparent rounded-full animate-spin"></div>
        <p className="font-serif italic text-magnolia-dark tracking-widest animate-pulse uppercase text-xs">
          Verificando Credenciales...
        </p>
      </div>
    );
  }

  // 🚫 PROTECCIÓN FINAL: No renderizamos nada si no hay permisos
  if (!user || !user.isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-magnolia-dark text-white shadow-lg">
        <div className="p-6 text-xl font-serif font-bold border-b border-magnolia-lilac/20 tracking-wider">
          Magnolia Admin
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300 ${
                  active
                    ? "bg-magnolia-lilac text-magnolia-dark font-bold shadow-md"
                    : "hover:bg-magnolia-lilac/20 text-gray-300"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Botón Cerrar Sesión (Desktop) */}
        <div className="p-4 border-t border-magnolia-lilac/10">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-red-300 hover:bg-red-500/10 transition-colors text-sm font-bold uppercase tracking-tighter"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- SIDEBAR (Mobile) --- */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-magnolia-dark text-white shadow-lg flex flex-col">
            <div className="p-6 flex justify-between items-center border-b border-magnolia-lilac/20">
              <span className="text-xl font-serif font-bold tracking-wider">Admin</span>
              <button onClick={() => setOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-magnolia-lilac" />
              </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              {links.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                      active ? "bg-magnolia-lilac text-magnolia-dark font-bold" : "hover:bg-magnolia-lilac/20"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-magnolia-lilac/10">
              <button 
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2 w-full text-red-300 font-bold text-sm"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                Salir
              </button>
            </div>
          </div>
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}></div>
        </div>
      )}

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Botón Hamburguesa (Mobile) */}
        <button
          className="md:hidden mb-6 p-2 rounded bg-magnolia-dark text-white shadow-md hover:bg-magnolia-lilac transition-colors"
          onClick={() => setOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}