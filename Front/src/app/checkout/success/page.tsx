"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  // Limpiamos el carrito automáticamente al llegar aquí
  useEffect(() => {
  clearCart(); 
}, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-green-50 p-4 rounded-full">
            <CheckCircle2 size={64} className="text-green-500" />
          </div>
        </div>
        
        <h2 className="text-3xl font-serif text-magnolia-dark mb-2">¡Pago exitoso!</h2>
        <p className="text-gray-500 mb-8">
          Tu pedido ha sido recibido y ya estamos preparando tus joyas con todo el amor de Magnolia.
        </p>

        <div className="space-y-4">
          <Link 
            href="/perfil/ordenes" 
            className="flex items-center justify-center gap-2 w-full bg-magnolia-dark text-white py-4 rounded-sm uppercase tracking-[0.2em] text-[10px] font-black hover:bg-magnolia-lilac transition-all"
          >
            Ver mis órdenes <ArrowRight size={14} />
          </Link>
          
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full text-gray-400 py-2 uppercase tracking-[0.2em] text-[9px] font-bold hover:text-magnolia-dark transition-colors"
          >
            <ShoppingBag size={14} /> Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}