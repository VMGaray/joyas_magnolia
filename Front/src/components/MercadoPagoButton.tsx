"use client";

import { Lock, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

// Definimos que el componente recibe "shippingData" como propiedad
export default function MercadoPagoButton({ shippingData }: { shippingData: any }) {
  const { items } = useCart();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    // 1. Verificación de sesión
    if (!token) {
      alert("Debes iniciar sesión para realizar el pago.");
      return;
    }

    // 2. Verificación de que completó el formulario de envío
    if (!shippingData.address || !shippingData.email || !shippingData.name) {
      alert("Por favor, completa todos los datos de envío antes de pagar.");
      return;
    }

    setLoading(true);

    try {
      // 3. Mapeo de productos con PRECIO REAL
      const productsToPay = items.map((item) => ({
        id: String(item.id),
        title: item.name,
        quantity: item.quantity || 1,
        // Usamos la lógica de Magnolia: el precio base * 1000
        unit_price: Math.round(Number(item.price) * 1000), 
        currency_id: "ARS",
      }));

      // 4. Construcción del cuerpo para el Backend
      const paymentBody = {
        userId: user?.id,
        items: productsToPay,
        shippingAddress: shippingData, // Aquí viaja el formulario de envío 📦
      };

      // 5. Petición al endpoint del Swagger
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

      // 6. Redirección a Mercado Pago
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
      className={`w-full py-4 rounded-sm font-bold text-sm uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#009EE3] text-white hover:bg-[#0087C3]"
      }`}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Lock size={16} />
      )}
      {loading ? "Generando pago seguro..." : "Pagar con Mercado Pago"}
    </button>
  );
}