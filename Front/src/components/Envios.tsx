"use client";

import { Truck, MapPin, Package, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function EnviosPage() {
  return (
    <main className="min-h-screen bg-white pb-20 font-sans">
      {/* --- HEADER DE PÁGINA --- */}
      <section className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-magnolia-dark mb-4 tracking-tight">
            Envíos y Entregas
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-[0.3em] font-medium">
            Llegamos a todo el país desde Villa General Belgrano
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* --- BLOQUE 1: ZONA LOCAL --- */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-magnolia-lilac">
              <div className="bg-magnolia-lilac/10 p-3 rounded-full">
                <MapPin size={24} />
              </div>
              <h2 className="font-serif text-2xl text-magnolia-dark">Zona Local</h2>
            </div>
            
            <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100/50">
              <p className="font-bold text-green-700 text-sm mb-2 uppercase tracking-wider">Beneficio Exclusivo</p>
              <h3 className="text-xl font-black text-gray-800 mb-2 italic">Envío Sin Cargo</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Bonificamos el 100% del costo de envío en todo el **Valle de Calamuchita**. 
              </p>
            </div>

            <ul className="space-y-4">
              <li className="flex gap-3">
                <ChevronRight size={16} className="text-magnolia-lilac shrink-0 mt-1" />
                <p className="text-sm text-gray-500"><strong>Retiro en Showroom:</strong> Podés retirar tu pedido por nuestro punto de venta en VGB coordinando previamente.</p>
              </li>
              <li className="flex gap-3">
                <ChevronRight size={16} className="text-magnolia-lilac shrink-0 mt-1" />
                <p className="text-sm text-gray-500"><strong>Plazos:</strong> Las entregas locales se realizan en un máximo de 24 a 48 hs hábiles.</p>
              </li>
            </ul>
          </div>

          {/* --- BLOQUE 2: RESTO DEL PAÍS --- */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-magnolia-lilac">
              <div className="bg-magnolia-lilac/10 p-3 rounded-full">
                <Truck size={24} />
              </div>
              <h2 className="font-serif text-2xl text-magnolia-dark">Resto del País</h2>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <p className="font-bold text-gray-400 text-[10px] mb-2 uppercase tracking-widest">Logística Nacional</p>
              <h3 className="text-xl font-black text-gray-800 mb-2 italic">Correo Argentino</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enviamos a cualquier punto del país. El costo se calcula en base al destino y peso del paquete.
              </p>
            </div>

            <ul className="space-y-4">
              <li className="flex gap-3">
                <ChevronRight size={16} className="text-magnolia-lilac shrink-0 mt-1" />
                <p className="text-sm text-gray-500 font-medium italic">Al realizar tu compra, seleccioná "Resto del país" y nos contactaremos por WhatsApp para coordinar el costo exacto.</p>
              </li>
              <li className="flex gap-3">
                <ChevronRight size={16} className="text-magnolia-lilac shrink-0 mt-1" />
                <p className="text-sm text-gray-500"><strong>Seguimiento:</strong> Una vez despachado, te brindamos el código de seguimiento para que rastrees tu joya en tiempo real.</p>
              </li>
            </ul>
          </div>

        </div>

        {/* --- CARACTERÍSTICAS DEL EMBALAJE --- */}
        <hr className="my-20 border-gray-100" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <Package size={32} className="text-gray-300" />
            <h4 className="font-serif text-lg text-magnolia-dark">Packaging Seguro</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Todas nuestras piezas viajan en estuches protectores para garantizar que lleguen impecables.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Clock size={32} className="text-gray-300" />
            <h4 className="font-serif text-lg text-magnolia-dark">Tiempo de Despacho</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Despachamos los pedidos dentro de las 72 hs hábiles después de confirmado el pago.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck size={32} className="text-gray-300" />
            <h4 className="font-serif text-lg text-magnolia-dark">Garantía de Entrega</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Acompañamos tu envío hasta que esté en tus manos. Tu compra está protegida.</p>
          </div>
        </div>

        {/* --- BOTÓN DE CONTACTO --- */}
        <div className="mt-20 bg-magnolia-dark p-8 md:p-12 rounded-[3rem] text-center text-white">
          <h3 className="font-serif text-2xl md:text-3xl mb-4">¿Tenés alguna duda sobre tu envío?</h3>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Escribinos y te ayudamos a elegir la mejor opción para que tu joya llegue rápido y segura.
          </p>
          <a 
            href="https://wa.me/5493546567106" 
            target="_blank"
            className="inline-block bg-white text-magnolia-dark px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-magnolia-lilac hover:text-white transition-all shadow-xl"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}