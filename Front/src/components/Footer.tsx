'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Instagram, Mail, MessageCircle, Loader2 } from "lucide-react";
import { notifySuccess, notifyError } from "@/components/helpers/Toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      notifyError("Por favor, ingresá un email válido 📩");
      return;
    }

    setLoading(true);

    try {
      // ✅ SIMULACIÓN DE ENVÍO
      // Cuando Andre tenga el endpoint, acá cambiarías esto por un fetch a /newsletter
      await new Promise((resolve) => setTimeout(resolve, 1000)); 

      notifySuccess("¡Gracias por suscribirte a Magnolia! ✨");
      setIsSubscribed(true);
      setEmail("");
    } catch (error) {
      notifyError("Hubo un error, intentá más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-magnolia-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        
        {/* GRILLA SUPERIOR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1: Marca, Redes y WhatsApp */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl tracking-widest">MAGNOLIA</h3>
            <p className="font-sans text-gray-400 text-sm leading-relaxed">
              Joyas diseñadas para celebrar nuevos comienzos y guardar recuerdos eternos.
            </p>
            
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/joyas.magnolias.vgb/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a href="mailto:magnoliajoyas7@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>

            <a 
              href="https://wa.me/5493546567106" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors mt-2"
            >
              <MessageCircle size={20} className="text-green-500" />
              <span className="font-sans text-sm tracking-wide">+54 9 3546 56-7106</span>
            </a>
          </div>

          {/* Columna 2: Shop */}
          <div>
            <h4 className="font-serif text-lg mb-6">Colecciones</h4>
            <ul className="space-y-3 font-sans text-sm text-gray-400">
              <li><Link href="/categoria/plata-925" className="hover:text-white transition-colors">Plata 925</Link></li>
              <li><Link href="/categoria/oro-18kl" className="hover:text-white transition-colors">Oro 18k</Link></li>
              <li><Link href="/categoria/enchapado" className="hover:text-white transition-colors">Enchapado</Link></li>
              <li><Link href="/categoria/personalizados" className="hover:text-white transition-colors">Personalizados</Link></li>
            </ul>
          </div>

          {/* Columna 3: Ayuda */}
          <div>
            <h4 className="font-serif text-lg mb-6">Ayuda</h4>
            <ul className="space-y-3 font-sans text-sm text-gray-400">
              <li><Link href="/envios" className="hover:text-white transition-colors">Envíos y Entregas</Link></li>
              <li><Link href="/cambios" className="hover:text-white transition-colors">Cambios y Devoluciones</Link></li>
              <li><Link href="/cuidado" className="hover:text-white transition-colors">Cuidado de las Joyas</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Columna 4: Newsletter (MODIFICADA) */}
          <div>
            <h4 className="font-serif text-lg mb-6">Newsletter</h4>
            {isSubscribed ? (
              <div className="bg-white/5 border border-magnolia-lilac/20 p-6 rounded-xl animate-in fade-in zoom-in duration-500">
                <p className="font-serif italic text-magnolia-lilac text-sm text-center">
                  ¡Te suscribiste con éxito!<br/>Pronto recibirás nuestras novedades.
                </p>
              </div>
            ) : (
              <>
                <p className="font-sans text-sm text-gray-400 mb-4">
                  Suscribite para recibir novedades y descuentos exclusivos.
                </p>
                <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu email" 
                    required
                    className="bg-transparent border border-gray-600 px-4 py-2 text-sm focus:outline-none focus:border-white transition-colors text-white"
                  />
                  <button 
                    disabled={loading}
                    className="bg-white text-magnolia-dark px-4 py-2 text-[10px] uppercase tracking-widest font-black hover:bg-magnolia-lilac hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Suscribirse"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>

      {/* BARRA INFERIOR */}
<div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-sans text-center md:text-left">
  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
    <p>&copy; {new Date().getFullYear()} Magnolia Joyas. Todos los derechos reservados.</p>
    <span className="hidden md:inline text-gray-700">|</span>
    <p className="flex items-center gap-1">
      Desarrollado por 
      <a 
        href="https://www.instagram.com/vmg.setup.ai/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-magnolia-lilac font-bold hover:text-white transition-colors tracking-widest"
      >
        VMG.setup.ai
      </a>
    </p>
  </div>

  <div className="flex gap-6">
    <Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
    <Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
  </div>
</div>

      </div>
    </footer>
  );
}