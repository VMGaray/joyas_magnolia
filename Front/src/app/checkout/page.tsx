"use client";

import { useCart } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import MercadoPagoButton from "@/components/MercadoPagoButton";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    lastname: "",
    address: "",
    city: "",
    zip: "",
    phone: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-serif text-magnolia-dark mb-4">Tu carrito está vacío</h2>
        <Link href="/" className="text-magnolia-lilac hover:underline">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-2 mb-8 text-gray-500 hover:text-magnolia-dark transition-colors w-fit">
          <ArrowLeft size={18} />
          <Link href="/">Volver a la tienda</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* FORMULARIO DE ENVÍO */}
          <div className="bg-white p-8 rounded-sm shadow-sm h-fit">
            <h2 className="font-serif text-2xl text-magnolia-dark mb-6">Datos de Envío</h2>
            <div className="space-y-6">
              <input name="email" type="email" onChange={handleInputChange} placeholder="Email" className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-magnolia-lilac" />
              <div className="grid grid-cols-2 gap-4">
                <input name="name" placeholder="Nombre" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none" />
                <input name="lastname" placeholder="Apellido" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none" />
              </div>
              <input name="address" placeholder="Dirección" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" placeholder="Ciudad" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none" />
                <input name="zip" placeholder="CP" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none" />
              </div>
              <input name="phone" type="tel" placeholder="Teléfono" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none" />
            </div>
          </div>

          {/* RESUMEN Y BOTÓN DE MERCADO PAGO */}
          <div className="bg-white p-8 rounded-sm shadow-sm h-fit lg:sticky lg:top-10 border-t-4 border-magnolia-lilac">
            <h2 className="font-serif text-2xl text-magnolia-dark mb-6">Resumen del Pedido</h2>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-0">
                  <div className="relative w-16 h-16 bg-gray-50 rounded-sm overflow-hidden">
                    <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-sm text-gray-800">{item.name}</h3>
                    <p className="text-[10px] text-gray-400">Cantidad: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-magnolia-dark text-sm">
                    {/* ✅ ELIMINADA MULTIPLICACIÓN POR 1000 */}
                    ${(Number(item.price) * item.quantity).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2 mb-8">
              <div className="flex justify-between text-xl font-serif text-magnolia-dark font-black pt-4">
                <span>Total</span>
                {/* ✅ ELIMINADA MULTIPLICACIÓN POR 1000 */}
                <span>${totalPrice.toLocaleString("es-AR")}</span>
              </div>
            </div>

            <MercadoPagoButton shippingData={formData} />
          </div>
        </div>
      </div>
    </main>
  );
}