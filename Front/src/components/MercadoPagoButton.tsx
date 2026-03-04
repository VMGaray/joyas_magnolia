"use client";

import { Lock, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function MercadoPagoButton() {
  const { items } = useCart();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    // 1. Verificación de seguridad
    if (!token) {
      alert("Debes iniciar sesión para realizar el pago.");
      return;
    }

    setLoading(true);

    try {
      // 2. Mapeo de productos con PRECIO CORREGIDO (* 1000)
      const productsToPay = items.map((item) => ({
        id: String(item.id),
        title: item.name,
        quantity: item.quantity || 1,
        // CORRECCIÓN: Multiplicamos por 1000 para pasar de 15.3 a 15300
        unit_price: Math.round(Number(item.price) * 1000), 
        currency_id: "ARS",
      }));

      // 3. Construcción del cuerpo de la petición
      const paymentBody = {
        orderId: crypto.randomUUID(), 
        userId: user?.id,
        items: productsToPay,
      };

      // 4. Petición al backend usando la variable de entorno
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mercado-pago/create-preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentBody),
      });

      // 5. Manejo de respuesta
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear la preferencia de pago");
      }

      const data = await res.json();

      // 6. Redirección al checkout de Mercado Pago
      // Nota: Usamos init_point para producción o sandbox_init_point para pruebas
      const redirectUrl = data.init_point || data.sandbox_init_point;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        throw new Error("No se recibió el punto de inicio de pago");
      }

    } catch (err: any) {
      console.error("Error en la pasarela de pago:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading || items.length === 0}
      className={`w-full py-4 rounded-sm font-bold text-sm uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#009EE3] text-white hover:bg-[#0087C3]"
      }`}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Lock size={16} />
      )}
      {loading ? "Generando pago..." : "Pagar con Mercado Pago"}
    </button>
  );
}