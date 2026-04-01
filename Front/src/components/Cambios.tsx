"use client";

import { RefreshCw, ShieldCheck, AlertCircle, Clock, CheckCircle2, MessageCircle } from "lucide-react";

export default function Cambios() {
  const politicas = [
    {
      icon: <Clock className="text-magnolia-lilac" size={24} />,
      title: "Plazo de Cambio",
      desc: "Tenés hasta 30 días corridos desde que recibiste tu joya para solicitar un cambio."
    },
    {
      icon: <AlertCircle className="text-magnolia-lilac" size={24} />,
      title: "Estado de la Pieza",
      desc: "La joya debe estar sin uso, en su packaging original y en perfectas condiciones."
    },
    {
      icon: <ShieldCheck className="text-magnolia-lilac" size={24} />,
      title: "Garantía",
      desc: "Nuestras piezas de Plata 925 y Oro tienen garantía de por vida por la calidad del metal."
    }
  ];

  return (
    <main className="min-h-screen bg-white pb-20 font-sans">
      {/* HEADER */}
      <section className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-magnolia-dark mb-4 tracking-tight">
            Cambios y Devoluciones
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-[0.3em] font-medium">
            Queremos que ames tu joya Magnolia
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl mt-16">
        {/* POLÍTICAS RÁPIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {politicas.map((item, index) => (
            <div key={index} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 bg-magnolia-lilac/10 w-fit p-3 rounded-full">
                {item.icon}
              </div>
              <h3 className="font-serif text-lg text-magnolia-dark mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* PASO A PASO */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-magnolia-dark mb-4 italic">¿Cómo realizo un cambio?</h2>
            <div className="w-20 h-1 bg-magnolia-lilac/30 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <span className="text-4xl font-serif text-magnolia-lilac/20 font-black italic shrink-0">01.</span>
              <div>
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-2">Contactanos</h4>
                <p className="text-sm text-gray-500 leading-relaxed"> Escribinos por WhatsApp o mail indicando tu número de pedido y la razón del cambio.</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <span className="text-4xl font-serif text-magnolia-lilac/20 font-black italic shrink-0">02.</span>
              <div>
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-2">Envío de la pieza</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Podés acercarte a nuestro punto de retiro en VGB o enviarla por correo (los costos de envío por cambios corren por cuenta del cliente, salvo fallas de origen).</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <span className="text-4xl font-serif text-magnolia-lilac/20 font-black italic shrink-0">03.</span>
              <div>
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-2">Nueva Joya</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Una vez recibida y verificada la pieza, te enviamos tu nueva elección o el crédito para tu próxima compra.</p>
              </div>
            </div>
          </div>
        </section>

        {/* NOTA IMPORTANTE */}
        <div className="mt-20 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center gap-6">
          <RefreshCw className="text-magnolia-lilac shrink-0 animate-spin-slow" size={40} />
          <div>
            <h4 className="font-serif text-lg text-magnolia-dark mb-2 italic">Aclaración sobre Personalizados</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Las piezas grabadas o realizadas a medida no tienen cambio ni devolución, ya que son creaciones exclusivas para vos. Por favor, verificá bien talles y grabados antes de confirmar.
            </p>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="mt-16 text-center">
          <a 
            href="https://wa.me/5493546567106" 
            className="inline-flex items-center gap-3 bg-magnolia-dark text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-magnolia-lilac transition-all"
          >
            <MessageCircle size={16} /> Iniciar un cambio por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}