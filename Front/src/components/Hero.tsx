import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full bg-gray-100">
      
      {/* CONTENEDOR DE LA IMAGEN */}
      <div className="relative w-full aspect-video md:aspect-3/1 max-h-[55vh] overflow-hidden">
         <Image 
           src="/banner-home2.jpg"
           alt="Colección Magnolia Joyas"
           fill
           className="object-cover object-center opacity-90"
           priority
         />
         {/* Overlay oscuro para que resalte el texto */}
         <div className="absolute inset-0 bg-black/20"></div>
      </div>
      

      {/* CONTENIDO DE TEXTO */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 text-white">
        
        <h2 className="font-serif text-3xl md:text-6xl drop-shadow-lg mb-4 tracking-wide">
          Nuevos Comienzos, <br className="hidden md:block" /> Belleza Eterna
        </h2>
        
        <p className="font-sans text-lg md:text-2xl font-light tracking-widest drop-shadow-md uppercase">
          Joyas que cuentan tu historia
        </p>

        
      </div>
    </section>
  );
}