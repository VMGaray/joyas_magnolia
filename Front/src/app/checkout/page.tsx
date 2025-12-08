"use client";

import { useCart } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();

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

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Encabezado simple */}
        <div className="flex items-center gap-2 mb-8 text-gray-500 hover:text-magnolia-dark transition-colors w-fit">
          <ArrowLeft size={18} />
          <Link href="/">Volver a la tienda</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="bg-white p-8 rounded-sm shadow-sm h-fit">
            <h2 className="font-serif text-2xl text-magnolia-dark mb-6">Datos de Envío</h2>
            
            <form className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email</label>
                <input type="email" placeholder="tu@email.com" className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" />
              </div>

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Nombre</label>
                    <input type="text" className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Apellido</label>
                    <input type="text" className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Dirección</label>
                <input type="text" placeholder="Calle y número" className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" />
              </div>

              {/* Ciudad y CP */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Ciudad</label>
                    <input type="text" className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Código Postal</label>
                    <input type="text" className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Teléfono</label>
                <input type="tel" placeholder="Para contactarte sobre el envío" className="w-full border border-gray-300 p-3 rounded-sm focus:outline-none focus:border-magnolia-lilac" />
              </div>

            </form>
          </div>

          {/* COLUMNA DERECHA: RESUMEN DE COMPRA */}
          <div className="bg-white p-8 rounded-sm shadow-sm h-fit lg:sticky lg:top-10">
            <h2 className="font-serif text-2xl text-magnolia-dark mb-6">Resumen del Pedido</h2>
            
            {/* Lista de items */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-0">
                  <div className="relative w-16 h-16 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-sm">
                        {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-sm text-gray-800">{item.name}</h3>
                  </div>
                  <span className="font-medium text-gray-600 text-sm">
                    ${(item.price * item.quantity).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="border-t border-gray-200 pt-4 space-y-2 mb-8">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span> {/* O lógica de envío */}
              </div>
              <div className="flex justify-between text-xl font-serif text-magnolia-dark font-bold pt-4 border-t border-gray-100 mt-4">
                <span>Total</span>
                <span>${totalPrice.toLocaleString("es-AR")}</span>
              </div>
            </div>

            {/* BOTÓN DE PAGO (Este se conectará al Backend) */}
            <button className="w-full bg-blue-500 text-white py-4 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center gap-2">
                <Lock size={16} />
                Pagar con Mercado Pago
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
                Tus datos personales se utilizarán para procesar tu pedido y mejorar tu experiencia en la web.
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}