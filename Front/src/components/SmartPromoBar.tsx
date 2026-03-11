'use client';

import { Sparkles, Percent, Star } from "lucide-react";

export default function SmartPromoBar() {
  const items = [
    { text: "Beneficio Silver: 10% OFF superando los $80.000", icon: <Percent size={14} /> },
    { text: "Selección Platinum: 15% OFF superando los $120.000", icon: <Sparkles size={14} /> },
    { text: "Envíos a todo el país", icon: <Star size={14} /> },
  ];

  return (
    <div className="w-full py-2 overflow-hidden border-b border-black/5 animate-bg-change">
      {/* Contenedor del scroll infinito */}
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Repetimos el contenido para que el bucle sea infinito y fluido */}
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-4 mx-12">
            <span className="text-magnolia-dark/40">{item.icon}</span>
            <span className="text-magnolia-dark text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]">
              {item.text}
            </span>
            <span className="text-magnolia-dark/40">{item.icon}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        /* Animación del Carrusel de Texto */
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 50s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Pausar al pasar el mouse */
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        /* Animación suave del Fondo */
        .animate-bg-change {
          animation: bgChange 15s infinite alternate ease-in-out;
        }

        @keyframes bgChange {
          0% { background-color: #E5D9E6; } /* Tu lila claro */
          50% { background-color: #F3EBF4; } /* Un tono más aireado */
          100% { background-color: #DDE8DD; } /* Un verde magnolia muy tenue */
        }
      `}</style>
    </div>
  );
}