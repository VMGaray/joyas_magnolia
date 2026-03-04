"use client";

import { useCart } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { createOrder, createPreference } from "@/lib/api";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para capturar los datos del formulario
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
        <Link href="/" className="text-magnolia-lilac hover:underline">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      setLoading(false);
      setError('Debes iniciar sesión para completar la compra');
      return;
    }

    // Unimos nombre y apellido para el envío
    const shippingAddress = {
      name: `${formData.name} ${formData.lastname}`,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      postalCode: formData.zip,
      phone: formData.phone
    };

    const orderPayload = {
      userId: user.id,
      items: items.map((it: any) => ({ 
        productId: it.id, 
        quantity: it.quantity,
        // Si el backend requiere precio aquí, recuerda el * 1000
      })),
      address: shippingAddress, // Pasamos la dirección capturada
    };

    try {
      // 1. Creamos la orden en tu base de datos
      const createdOrder = await createOrder(orderPayload);
      
      // 2. Creamos la preferencia de Mercado Pago
      const pref = await createPreference({ 
        orderId: createdOrder.id, 
        userId: user.id 
      });

      // 3. Redirigimos al usuario al checkout de Mercado Pago
      const redirectUrl = pref?.init_point || pref?.sandbox_init_point;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        setError('No se pudo obtener la URL de pago');
      }
    } catch (err: any) {
      console.error('Checkout error', err);
      setError(err?.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

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
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email</label>
                <input name="email" type="email" onChange={handleInputChange} placeholder="tu@email.com" className="w-full border border-gray-300 p-3 rounded-sm focus:border-magnolia-lilac outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Nombre</label>
                  <input name="name" type="text" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm focus:border-magnolia-lilac outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Apellido</label>
                  <input name="lastname" type="text" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm focus:border-magnolia-lilac outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Dirección</label>
                <input name="address" type="text" onChange={handleInputChange} placeholder="Calle y número" className="w-full border border-gray-300 p-3 rounded-sm focus:border-magnolia-lilac outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Ciudad</label>
                  <input name="city" type="text" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm focus:border-magnolia-lilac outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Código Postal</label>
                  <input name="zip" type="text" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm focus:border-magnolia-lilac outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Teléfono</label>
                <input name="phone" type="tel" onChange={handleInputChange} placeholder="Para contactarte sobre el envío" className="w-full border border-gray-300 p-3 rounded-sm focus:border-magnolia-lilac outline-none" />
              </div>
            </div>
          </div>

          {/* RESUMEN Y BOTÓN */}
          <div className="bg-white p-8 rounded-sm shadow-sm h-fit lg:sticky lg:top-10">
            <h2 className="font-serif text-2xl text-magnolia-dark mb-6">Resumen del Pedido</h2>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-0">
                  <div className="relative w-16 h-16 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                    <Image 
                      src={item.image || "/placeholder.jpg"} // Si no hay imagen, usa un dibujo genérico
                      alt={item.name} 
                      fill 
                      className="object-cover" 
                    />
                    <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-sm">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-sm text-gray-800">{item.name}</h3>
                  </div>
                  <span className="font-medium text-gray-600 text-sm">
                    ${(Number(item.price) * item.quantity * 1000).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2 mb-8">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>${(totalPrice * 1000).toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between text-xl font-serif text-magnolia-dark font-bold pt-4 border-t border-gray-100 mt-4">
                <span>Total</span>
                <span>${(totalPrice * 1000).toLocaleString("es-AR")}</span>
              </div>
            </div>

            <button 
              onClick={handlePayment} 
              disabled={loading} 
              className={`w-full py-4 rounded-sm font-bold text-sm uppercase tracking-widest transition-colors shadow-md flex items-center justify-center gap-2 ${loading ? 'bg-gray-300 text-gray-600' : 'bg-[#009EE3] text-white hover:bg-[#0087C3]'}`}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
              {loading ? 'Procesando...' : 'Pagar con Mercado Pago'}
            </button>
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}