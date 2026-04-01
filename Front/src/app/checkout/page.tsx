"use client";

import { useCart } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, Tag, Truck, Info } from "lucide-react"; // Agregué Truck e Info
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

  // ✅ NUEVO ESTADO PARA EL ENVÍO
  const [shippingMethod, setShippingMethod] = useState("calamuchita");

  const shippingOptions = [
    { id: "calamuchita", label: "Valle de Calamuchita", desc: "Envío sin cargo en la zona" },
    { id: "vgb", label: "Retiro en local (VGB)", desc: "Retirá por el showroom" },
    { id: "nacional", label: "Resto del país", desc: "A coordinar post-compra" }
  ];

  // --- LÓGICA DE DESCUENTOS ---
  const PROMO_SILVER = 80000;
  const PROMO_PLATINUM = 120000;
  
  let descuento = 0;
  let etiquetaDescuento = "";

  if (totalPrice >= PROMO_PLATINUM) {
    descuento = totalPrice * 0.15;
    etiquetaDescuento = "15% OFF (Nivel Platinum)";
  } else if (totalPrice >= PROMO_SILVER) {
    descuento = totalPrice * 0.10;
    etiquetaDescuento = "10% OFF (Nivel Silver)";
  }

  const finalTotal = totalPrice - descuento;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-serif text-magnolia-dark mb-4">Tu carrito está vacío</h2>
        <Link href="/" className="text-magnolia-lilac hover:underline font-bold uppercase text-xs tracking-widest">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-2 mb-8 text-gray-500 hover:text-magnolia-dark transition-colors w-fit">
          <ArrowLeft size={18} />
          <Link href="/" className="text-sm font-bold uppercase tracking-widest">Volver a la tienda</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* FORMULARIO DE ENVÍO */}
          <div className="bg-white p-8 rounded-sm shadow-sm h-fit border border-gray-100">
            <h2 className="font-serif text-2xl text-magnolia-dark mb-6">Datos de Envío</h2>
            <div className="space-y-6">
              <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-magnolia-lilac text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input name="name" value={formData.name} placeholder="Nombre" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-magnolia-lilac text-sm" />
                <input name="lastname" value={formData.lastname} placeholder="Apellido" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-magnolia-lilac text-sm" />
              </div>
              <input name="address" value={formData.address} placeholder="Dirección" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-magnolia-lilac text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" value={formData.city} placeholder="Ciudad" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-magnolia-lilac text-sm" />
                <input name="zip" value={formData.zip} placeholder="CP" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-magnolia-lilac text-sm" />
              </div>
              <input name="phone" value={formData.phone} type="tel" placeholder="Teléfono (WhatsApp)" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-magnolia-lilac text-sm" />
            </div>
          </div>

          {/* RESUMEN Y PAGO */}
          <div className="bg-white p-8 rounded-sm shadow-sm h-fit lg:sticky lg:top-10 border-t-4 border-magnolia-lilac">
            <h2 className="font-serif text-2xl text-magnolia-dark mb-6">Resumen del Pedido</h2>
            
            <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-gray-50 pb-4 last:border-0">
                  <div className="relative w-16 h-16 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-[13px] text-gray-800 leading-tight">{item.name}</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Cantidad: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-gray-700 text-sm">
                    ${(item.price * item.quantity).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>

            {/* ✅ SECCIÓN DE MÉTODO DE ENVÍO */}
            <div className="mb-8 border-y border-gray-100 py-6">
              <h3 className="font-serif text-lg text-magnolia-dark mb-4 flex items-center gap-2 uppercase text-xs tracking-widest font-bold">
                <Truck size={16} className="text-magnolia-lilac" /> 
                Seleccioná tu envío
              </h3>
              
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <label 
                    key={option.id}
                    className={`flex items-center justify-between p-4 rounded-sm border cursor-pointer transition-all ${
                      shippingMethod === option.id 
                      ? "border-magnolia-lilac bg-magnolia-lilac/5 shadow-sm" 
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="shipping"
                        value={option.id}
                        checked={shippingMethod === option.id}
                        onChange={() => setShippingMethod(option.id)}
                        className="w-4 h-4 text-magnolia-lilac focus:ring-magnolia-lilac border-gray-300"
                      />
                      <div>
                        <p className="text-[12px] font-bold text-gray-800 uppercase tracking-tight">{option.label}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{option.desc}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black ${option.id === 'nacional' ? 'text-magnolia-dark' : 'text-green-600'}`}>
                      {option.id === "nacional" ? "A CONVENIR" : "GRATIS"}
                    </span>
                  </label>
                ))}
              </div>

              {shippingMethod === "nacional" && (
                <div className="mt-4 p-3 bg-gray-50 border border-dashed border-gray-200 rounded-sm flex items-start gap-2">
                  <Info size={14} className="text-magnolia-lilac mt-0.5 shrink-0" />
                  <p className="text-[10px] text-gray-500 leading-relaxed italic">
                    Para envíos fuera de Calamuchita, nos contactaremos por WhatsApp para pasarte el presupuesto de Correo Argentino y coordinar el pago.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString("es-AR")}</span>
              </div>

              {descuento > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#7B9E7D] font-bold flex items-center gap-1 uppercase text-[10px] tracking-widest">
                    <Tag size={12} /> {etiquetaDescuento}
                  </span>
                  <span className="text-[#7B9E7D] font-black">
                    - ${descuento.toLocaleString("es-AR")}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-500 pb-2 border-b border-gray-100">
                <span>Envío</span>
                <span className={`font-bold uppercase text-[10px] ${shippingMethod === 'nacional' ? 'text-magnolia-dark' : 'text-green-600'}`}>
                  {shippingMethod === 'nacional' ? "A convenir" : "Sin cargo"}
                </span>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <span className="font-serif text-xl text-magnolia-dark font-black">Total</span>
                <span className="text-2xl font-black text-magnolia-dark">
                  ${Math.round(finalTotal).toLocaleString("es-AR")}
                </span>
              </div>
            </div>

            {/* ✅ El botón ahora recibe también el método de envío si Andre necesita guardarlo */}
            <MercadoPagoButton 
              shippingData={{ ...formData, shippingMethod }} 
              amount={finalTotal} 
            />
            
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
              <Lock size={12} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Pago 100% Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}