'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard", icon: HomeIcon },
    { href: "/admin/productos", label: "Productos", icon: CubeIcon },
    { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardDocumentListIcon },
    { href: "/admin/usuarios", label: "Usuarios", icon: UserGroupIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block w-64 bg-magnolia-dark text-white shadow-lg">
        <div className="p-6 text-xl font-bold border-b border-magnolia-lilac">Admin Panel</div>
        <nav className="p-4 space-y-2">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  active
                    ? "bg-magnolia-lilac text-white"
                    : "hover:bg-magnolia-lilac/30"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Sidebar (mobile) */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-magnolia-dark text-white shadow-lg">
            <div className="p-6 flex justify-between items-center border-b border-magnolia-lilac">
              <span className="text-xl font-bold">Admin Panel</span>
              <button onClick={() => setOpen(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {links.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      active
                        ? "bg-magnolia-lilac text-white"
                        : "hover:bg-magnolia-lilac/30"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          {/* Fondo oscuro detrás del sidebar */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setOpen(false)}
          ></div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        {/* Botón hamburguesa en mobile */}
        <button
          className="md:hidden mb-4 p-2 rounded bg-magnolia-dark text-white"
          onClick={() => setOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        {children}
      </main>
    </div>
  );
}
