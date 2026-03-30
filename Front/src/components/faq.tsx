'use client';

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "¿Cuáles son los métodos de envío?",
      a: "Realizamos envíos a todo el país a través de Correo Argentino. También contamos con puntos de retiro en Villa General Belgrano. Los envío en el Valle de Calamuchita son sin costo"
    },
    {
      q: "¿Cómo sé cuál es mi talle de anillo?",
      a: "Podés medir el diámetro interno de un anillo que te quede bien con una regla. Si tenés dudas, escribinos y te enviamos nuestra guía de talles."
    },
    {
      q: "¿Qué pasa si mi pedido llega dañado?",
      a: "Todas nuestras piezas pasan por un control de calidad. Si hubo un problema en el correo, contactanos dentro de las 48hs con una foto del paquete."
    },
    {
      q: "¿Las joyas tienen garantía?",
      a: "Garantizamos la calidad del metal (Plata 925 u Oro 18k). No cubrimos roturas por mal uso o pérdida de piedras por golpes."
    },
    {
      q: "¿Realizan grabados personalizados?",
      a: "¡Sí! Consultanos por WhatsApp para piezas grabadas a medida. Tienen una demora de fabricación de 5 a 7 días hábiles."
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-serif text-4xl text-center text-magnolia-dark mb-12">Preguntas Frecuentes</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex justify-between items-center text-left"
              >
                <span className="font-bold text-gray-700 text-sm">{faq.q}</span>
                <ChevronDown className={`text-magnolia-lilac transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed animate-in fade-in slide-in-from-top-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}