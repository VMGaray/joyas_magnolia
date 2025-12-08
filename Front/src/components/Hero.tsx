import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    // Quitamos las alturas fijas h-[500px] del section
    <section className="relative w-full bg-gray-100">
      
      {/* CONTENEDOR DE LA IMAGEN */}
      {/* Usamos 'aspect' para darle una proporción apaisada linda (21:9 o 16:9) */}
      {/* max-h-[80vh] limita la altura al 80% de la pantalla para que no sea excesiva */}
      <div className="relative w-full aspect-video md:aspect-3/1 max-h-[55vh] overflow-hidden">
         <Image 
           src="/banner-home2.jpg"
           alt="Magnolia Joyas Collection"
           fill
           // Cambiamos object-top por object-center para que enfoque el medio
           className="object-cover object-center opacity-90"
           priority
         />
         {/* Overlay oscuro */}
         <div className="absolute inset-0 bg-black/20"></div>
      </div>
      

      {/* CONTENIDO DE TEXTO (Ahora "flota" sobre el contenedor de la imagen) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 text-white">
        
        <h2 className="font-serif text-3xl md:text-6xl drop-shadow-lg mb-4 tracking-wide">
          New Beginnings, <br className="hidden md:block" /> Timeless Beauty
        </h2>
        
        <p className="font-sans text-lg md:text-2xl font-light tracking-widest mb-8 drop-shadow-md uppercase">
          Spring Collection
        </p>

        <Link 
          href="/categoria/plata-925"
          className="bg-magnolia-lilac hover:bg-white text-white hover:text-magnolia-lilac px-8 py-3 md:px-10 md:py-4 rounded-sm font-sans uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-300 shadow-xl border border-transparent hover:border-magnolia-lilac"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}