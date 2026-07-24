'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, LogOut, UserCircle } from "lucide-react";

export default function AdminBar() {
  const { user, isLoggedIn, loading, logout } = useAuth(); // ✅ Agregamos logout

  if (loading || !isLoggedIn || !user?.isAdmin) return null;

  return (
    <div className="bg-magnolia-dark text-white py-2 px-6 flex justify-between items-center sticky top-0 z-[100] border-b border-magnolia-lilac/20 shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-magnolia-lilac/10 rounded-full border border-magnolia-lilac/20">
          <UserCircle size={14} className="text-magnolia-lilac" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-magnolia-lilac">
            Admin: {user.username || user.email || "Admin"}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Link 
          href="/admin" 
          className="group flex items-center gap-2 bg-magnolia-lilac text-magnolia-dark px-4 py-1.5 rounded-sm transition-all hover:bg-white font-sans text-[11px] font-bold uppercase tracking-widest shadow-sm"
        >
          <LayoutDashboard size={14} />
          Volver al Panel
        </Link>

        {/* ✅ Botón de Cerrar Sesión rápido */}
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors text-[10px] uppercase font-bold tracking-widest border-l border-white/10 pl-4 ml-2"
        >
          <LogOut size={14} />
          Salir
        </button>
      </div>
    </div>
  );
}