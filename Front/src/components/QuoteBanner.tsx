import Image from "next/image";

export default function QuoteBanner() {
  return (
    <section className="w-full bg-white mb-16">
      <div className="container mx-auto px-0 md:px-4">
        
        {/* Contenedor Flex: Texto a la izquierda, Foto a la derecha */}
        <div className="flex flex-col md:flex-row w-full h-auto md:h-[300px]">
          
          {/* 1. BLOQUE DE TEXTO (Ocupa más espacio en PC) */}
          <div className="w-full md:w-3/4 bg-[#F3EFEA] flex items-center justify-center p-10 md:p-0 relative overflow-hidden">
            {/* Un pequeño detalle decorativo de fondo (opcional) */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            <p className="font-serif text-2xl md:text-4xl text-gray-700 text-center italic tracking-wide leading-relaxed max-w-2xl">
              “Pequeños destellos que guardan grandes recuerdos.”
            </p>
          </div>

          {/* 2. BLOQUE DE IMAGEN (Ocupa menos espacio, detalle) */}
          <div className="w-full md:w-1/4 relative h-64 md:h-full">
            <Image 
              src="/frase-detalle.jpg"
              alt="Detalle anillo"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}