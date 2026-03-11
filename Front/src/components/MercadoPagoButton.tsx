"use client";

import { Lock, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

// Recibe shippingData y el amount final ya calculado con descuentos
export default function MercadoPagoButton({ 
  shippingData, 
  amount 
}: { 
  shippingData: any; 
  amount: number; 
}) {
  const { items, totalPrice } = useCart();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    // 1. Verificaciones básicas
    if (!token) {
      alert("Debes iniciar sesión para realizar el pago.");
      return;
    }

    if (!shippingData.address || !shippingData.email || !shippingData.name) {
      alert("Por favor, completa todos los datos de envío antes de pagar.");
      return;
    }

    setLoading(true);

    try {
      /**
       * 🛡️ LÓGICA SENIOR: MANEJO DE DESCUENTOS EN MERCADO PAGO
       * Calculamos el factor de descuento (ej: 0.90 para un 10% OFF)
       * para aplicarlo a cada producto individualmente.
       */
      const discountFactor = amount / totalPrice;

      const productsToPay = items.map((item) => ({
        id: String(item.id),
        title: item.name,
        quantity: item.quantity || 1,
        // Aplicamos el factor de descuento al precio unitario real
        unit_price: Math.round(Number(item.price) * discountFactor), 
        currency_id: "ARS",
      }));

      const paymentBody = {
        userId: user?.id,
        items: productsToPay,
        shippingAddress: shippingData,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mercado-pago/create-preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear la preferencia");
      }

      const data = await res.json();
      const redirectUrl = data.init_point || data.sandbox_init_point;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        throw new Error("No se pudo obtener la URL de pago");
      }

    } catch (err: any) {
      console.error("Error en la pasarela:", err);
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
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#009EE3] text-white hover:bg-[#0087C3] active:scale-[0.98]"
      }`}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Lock size={14} />
      )}
      {loading ? "Procesando..." : "Finalizar y Pagar"}
    </button>
  );
}