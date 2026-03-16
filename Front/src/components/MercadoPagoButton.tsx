"use client";

import { Lock, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

interface MercadoPagoButtonProps {
  shippingData: any;
  amount: number;
}

export default function MercadoPagoButton({ shippingData, amount }: MercadoPagoButtonProps) {
  const { items, totalPrice } = useCart();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!token || !user) {
      alert("Debes iniciar sesión para realizar el pago.");
      return;
    }

    setLoading(true);

    try {
      // 1. CREAMOS LA ORDEN REAL EN EL BACKEND
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!orderRes.ok) throw new Error("No se pudo crear la orden.");
      const orderData = await orderRes.json();

      // 2. CREAMOS LA PREFERENCIA DE MP
      const discountFactor = amount / totalPrice;
      const mpItems = items.map((item) => ({
        title: item.name,
        quantity: Number(item.quantity),
        unit_price: Math.round(Number(item.price) * discountFactor),
        currency_id: "ARS",
      }));

      const preferenceRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mercado-pago/create-preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: orderData.id,
          userId: user.id,
          items: mpItems,
          shippingAddress: shippingData,
          // ✅ MEJORA: Definimos retornos manuales para evitar el bucle del túnel
          back_urls: {
            success: "http://localhost:3000/checkout/success",
            failure: "http://localhost:3000/checkout/failure",
            pending: "http://localhost:3000/checkout/success"
          },
          // ❌ IMPORTANTE: NO usamos auto_return para evitar el ERR_TOO_MANY_REDIRECTS
        }),
      });

      if (!preferenceRes.ok) throw new Error("Error al generar el link de pago.");

      const mpData = await preferenceRes.json();

     // ... (después de obtener mpData)

const redirectUrl = mpData.sandbox_init_point;

if (redirectUrl) {
  setLoading(false);
  // ✅ SOLUCIÓN: Abrir en pestaña nueva para evitar el bucle de redirección del túnel
  window.open(redirectUrl, '_blank', 'noopener,noreferrer');
} else {
  throw new Error("No se recibió la URL de Sandbox de Mercado Pago.");
}

    } catch (err: any) {
      console.error("Error en el proceso de pago:", err);
      alert(`Hubo un problema: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading || items.length === 0}
      className={`w-full py-4 rounded-sm font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#009EE3] text-white hover:bg-[#0087C3]"
      }`}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Lock size={14} />
      )}
      {loading ? "Procesando pedido..." : "Finalizar y Pagar"}
    </button>
  );
}