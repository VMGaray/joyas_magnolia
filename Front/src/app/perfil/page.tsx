"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProfileDashboard } from "@/components/Profile/ProfileDashboard";
import { Loader2 } from "lucide-react";

export default function PerfilPage() {
  const { user, loading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 🛡️ Lógica de Redirección para Magnolia Joyas
    if (!loading) {
      if (!isLoggedIn) {
        // Si no está logueado, al login
        router.replace("/login");
      } else if (user?.isAdmin) {
        // ✅ Si es ADMIN, lo mandamos directo al Dashboard
        router.replace("/admin");
      }
    }
  }, [user, loading, isLoggedIn, router]);

  // Mientras chequeamos quién es, mostramos un estado de carga elegante
  if (loading || (isLoggedIn && user?.isAdmin)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-magnolia-lilac" size={40} />
        <p className="font-serif italic text-magnolia-dark tracking-widest">
          Redirigiendo al Panel...
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <ProfileDashboard />
    </main>
  );
}