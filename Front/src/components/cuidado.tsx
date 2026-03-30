'use client';

import { Sparkles, Droplets, Wind, ShieldCheck } from "lucide-react";

export default function CuidadoJoyas() {
  const tips = [
    {
      icon: <Droplets className="text-magnolia-lilac" size={28} />,
      title: "Evitá el contacto con líquidos",
      desc: "Quitatelas antes de ducharte, entrar a la pileta o al mar. El cloro y la salitre pueden dañar el brillo original."
    },
    {
      icon: <Wind className="text-magnolia-lilac" size={28} />,
      title: "Perfumes y Cremas",
      desc: "Ponete tus joyas después de que el perfume o las cremas se hayan secado en tu piel. Los químicos pueden opacar los metales."
    },
    {
      icon: <ShieldCheck className="text-magnolia-lilac" size={28} />,
      title: "Guardado Individual",
      desc: "Guardalas en su estuche o bolsita de tela para evitar rayones por el roce con otras piezas."
    },
    {
      icon: <Sparkles className="text-magnolia-lilac" size={28} />,
      title: "Limpieza Suave",
      desc: "Limpiá tus joyas de plata con un paño seco y suave. No uses productos abrasivos ni bicarbonato en piezas enchapadas."
    }
  ];

  return (
    <main className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-magnolia-dark mb-4">Cuidado de tus Joyas</h1>
          <p className="font-serif italic text-gray-500">Mantené el brillo de tus recuerdos por más tiempo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tips.map((tip, index) => (
            <div key={index} className="p-8 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
              <div className="mb-4">{tip.icon}</div>
              <h3 className="font-serif text-xl text-gray-800 mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-magnolia-lilac/5 p-8 rounded-3xl text-center">
          <p className="text-magnolia-dark font-medium italic">{ "Una joya bien cuidada es una historia que no pierde su luz." }</p>
        </div>
      </div>
    </main>
  );
}