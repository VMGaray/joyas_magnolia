import Link from "next/link";
import { Facebook, Instagram, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
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
            
            {/* Redes Sociales */}
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="mailto:hola@magnolia.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>

            {/* Link de WhatsApp Agregado */}
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
              <li><Link href="/categoria/oro-18kl" className="hover:text-white transition-colors">Oro 18kl</Link></li>
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

          {/* Columna 4: Newsletter */}
          <div>
            <h4 className="font-serif text-lg mb-6">Newsletter</h4>
            <p className="font-sans text-sm text-gray-400 mb-4">
              Suscribite para recibir novedades y descuentos exclusivos.
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="bg-transparent border border-gray-600 px-4 py-2 text-sm focus:outline-none focus:border-white transition-colors"
              />
              <button className="bg-white text-magnolia-dark px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-magnolia-lilac hover:text-white transition-colors">
                Suscribirse
              </button>
            </form>
          </div>

        </div>

        {/* BARRA INFERIOR (Copyright) */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-sans">
          <p>&copy; {new Date().getFullYear()} Magnolia Joyas. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="hover:text-white">Política de Privacidad</Link>
            <Link href="/terminos" className="hover:text-white">Términos y Condiciones</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}