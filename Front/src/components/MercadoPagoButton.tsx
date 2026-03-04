"use client";

import { Lock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function MercadoPagoButton() {
  const { items } = useCart();
  const { token, user } = useAuth();

  const handlePay = async () => {
    // 1. Verificación de seguridad
    if (!token) {
      alert("Debes iniciar sesión para realizar el pago.");
      return;
    }

    try {
      // 2. Mapeo de productos al formato que espera Mercado Pago
      const productsToPay = items.map((item) => ({
        id: item.id,
        title: item.name,
        quantity: item.quantity || 1,
        unit_price: Number(item.price),
      }));

      // 3. Construcción del cuerpo de la petición según el DTO del backend
      const paymentBody = {
        orderId: crypto.randomUUID(), // Genera el UUID requerido por el backend
        userId: user?.id,
        items: productsToPay,
      };

      // 4. Petición al backend
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
        // Si hay errores de validación (como el UUID), aparecerán aquí
        throw new Error(errorData.message || "Error al crear la preferencia de pago");
      }

      const data = await res.json();

      // 6. Redirección al checkout de Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error("No se recibió el punto de inicio de pago");
      }

    } catch (err: any) {
      console.error("Error en la pasarela de pago:", err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <button
      onClick={handlePay}
      className="w-full bg-blue-600 text-white py-4 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
    >
      <Lock size={16} />
      Pagar con Mercado Pago
    </button>
  );
}