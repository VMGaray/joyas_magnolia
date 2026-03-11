'use client';

import { Sparkles, Percent } from "lucide-react";

export default function PromoBanner() {
  return (
    // Agregamos el ID "destacados" y scroll-mt-24 para que el navbar no lo tape al bajar
    <section id="destacados" className="w-full bg-white py-16 border-y border-gray-100 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-items-center">
          
          {/* Opción 1: 10% OFF - Verde Fuerte */}
          <div className="group relative flex items-center gap-6 p-8 rounded-3xl transition-all duration-500 hover:bg-[#C6D8C8]/10 w-full max-w-md border border-transparent hover:border-[#7B9E7D]/20">
            <div 
              style={{ backgroundColor: '#7B9E7D' }}
              className="flex-shrink-0 w-20 h-20 text-white rounded-full flex flex-col items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500"
            >
              <span className="text-2xl font-black leading-none">10%</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">OFF</span>
            </div>
            <div>
              <h3 style={{ color: '#7B9E7D' }} className="font-bold uppercase tracking-[0.2em] text-[10px] mb-1">
                Beneficio Silver
              </h3>
              <p className="text-gray-600 font-serif italic text-xl leading-snug">
                Superando los <span className="text-black font-bold">$80.000</span>
              </p>
            </div>
          </div>

          {/* Opción 2: 15% OFF - Lila Fuerte */}
          <div className="group relative flex items-center gap-6 p-8 rounded-3xl transition-all duration-500 hover:bg-[#D8C8D9]/10 w-full max-w-md border border-transparent hover:border-[#9D7B9E]/20">
            <div 
              style={{ backgroundColor: '#9D7B9E' }}
              className="flex-shrink-0 w-20 h-20 text-white rounded-full flex flex-col items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500"
            >
              <span className="text-2xl font-black leading-none">15%</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">OFF</span>
            </div>
            <div>
              <h3 style={{ color: '#9D7B9E' }} className="font-bold uppercase tracking-[0.2em] text-[10px] mb-1 flex items-center gap-2">
                <Sparkles size={12} /> Selección Platinum
              </h3>
              <p className="text-gray-600 font-serif italic text-xl leading-snug">
                Superando los <span className="text-black font-bold">$120.000</span>
              </p>
            </div>
          </div>

        </div>
        
        {/* Decoración sutil inferior */}
        <div className="mt-12 flex justify-center opacity-10">
          <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent via-black to-transparent"></div>
        </div>
      </div>
    </section>
  );
}