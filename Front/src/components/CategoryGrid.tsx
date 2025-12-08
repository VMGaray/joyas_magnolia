import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    title: "Anillos",
    href: "/categoria/anillos",
    image: "/cat-anillos.jpg",
    color: "bg-[#D8C8D9]",
  },
  {
    title: "Cadenas",
    href: "/categoria/cadenas",
    image: "/cat-cadenas.jpg",
    color: "bg-[#C6D8C8]",
  },
  {
    title: "Aros",
    href: "/categoria/aros",
    image: "/cat-aros.jpg",
    color: "bg-[#D8C8C8]",
  },
  {
    title: "Pulseras",
    href: "/categoria/pulseras",
    image: "/cat-pulseras.jpg",
    color: "bg-[#C8D1D8]",
  },
  {
    title: "Dijes",
    href: "/categoria/dijes",
    image: "/cat-dijes.jpg",
    color: "bg-[#E6D0C5]",
  },
  {
    title: "Conjuntos",
    href: "/categoria/conjuntos",
    image: "/cat-conjuntos.jpg",
    color: "bg-[#D9D9D9]",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        
        <h2 className="font-serif text-3xl md:text-4xl text-magnolia-dark mb-8 text-left">
          Comprar por Categoría
        </h2>

        {/* CAMBIO CLAVE EN LA GRILLA:
            - grid-cols-2: Celulares (2 columnas, quedan grandecitos para tocar con el dedo)
            - md:grid-cols-3: Tablets (3 columnas)
            - lg:grid-cols-6: Computadoras (6 columnas). Al poner 6 en fila, se achican un montón.
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.title} 
              href={cat.href}
              className="group block relative overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-sm"
            >
              {/* CAMBIO CLAVE EN LA FORMA:
                  - aspect-square: Cuadrado perfecto (1x1). Es más bajo que el anterior.
              */}
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Franja de color más finita */}
              <div className={`${cat.color} py-2 text-center`}>
                <span className="font-serif text-white text-sm md:text-base tracking-wide">
                  {cat.title}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}