"use client";

import { Lock, Loader2, CheckCircle2 } from "lucide-react";
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
  const [loadingStep, setLoadingStep] = useState<"idle" | "order" | "preference">("idle");

  const handlePay = async () => {
    if (!token || !user) {
      alert("Debes iniciar sesión para realizar el pago.");
      return;
    }

    // Paso 1: Registrar Orden
    setLoadingStep("order");

    try {
      // 🟢 ORDEN: Esperamos a que el back guarde el pedido
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          userName: (user as any).username || (user as any).name || "Cliente Magnolia",
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress: `${shippingData.address}, ${shippingData.city}`,
          contactPhone: shippingData.phone,
          totalAmount: amount
        }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || "No se pudo crear la orden.");
      }
      
      const orderData = await orderRes.json();
      console.log("✅ Orden creada con ID:", orderData.id);

      // Paso 2: Crear Preferencia
      setLoadingStep("preference");

      const discountFactor = amount / totalPrice;
      const mpItems = items.map((item) => ({
        title: item.name,
        quantity: Number(item.quantity),
        unit_price: Math.round(Number(item.price) * discountFactor),
        currency_id: "ARS",
      }));

      // 🔵 PREFERENCIA: Ahora enviamos el ID que nos dio el paso anterior
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
          back_urls: {
            success: `${window.location.origin}/checkout/success`,
            failure: `${window.location.origin}/checkout/failure`,
            pending: `${window.location.origin}/checkout/success`
          },
        }),
      });

      if (!preferenceRes.ok) throw new Error("Error al generar preferencia de pago.");

      const mpData = await preferenceRes.json();
      const redirectUrl = mpData.init_point;

      if (redirectUrl) {
        // Redirección en la misma pestaña para evitar bucles de seguridad (reconocimiento facial)
        window.location.href = redirectUrl;
      } else {
        throw new Error("No se recibió la URL de Mercado Pago.");
      }

    } catch (err: any) {
      console.error("Error en el proceso:", err);
      alert(`Hubo un problema: ${err.message}`);
      setLoadingStep("idle");
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loadingStep !== "idle" || items.length === 0}
      className={`w-full py-4 rounded-sm font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg ${
        loadingStep !== "idle" ? "bg-gray-400 cursor-not-allowed" : "bg-[#009EE3] text-white hover:bg-[#0087C3]"
      }`}
    >
      {loadingStep === "order" && (
        <><Loader2 className="animate-spin" size={18} /> Registrando pedido...</>
      )}
      {loadingStep === "preference" && (
        <><CheckCircle2 size={18} className="text-green-200" /> Generando link de pago...</>
      )}
      {loadingStep === "idle" && (
        <><Lock size={14} /> Finalizar y Pagar</>
      )}
    </button>
  );
}