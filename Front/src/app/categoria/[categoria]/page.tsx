import Image from 'next/image';
import Link from 'next/link';
import WishlistButton from '@/components/WishlistButton';
import AddToCartButton from '@/components/AddToCartButton';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  imageUrl: string | null;
  productType: string;
  category?: string;
  material?: string; 
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Error al cargar productos: ${res.status}`);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error('Fetch error:', err);
    return [];
  }
}

export default async function CategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.categoria; 

  const allProducts = await getAllProducts();

  // FILTRADO POR NIVELES PARA EVITAR MEZCLAS
  const products = allProducts.filter(p => {
    const searchSlug = slug.toLowerCase();
    
    const typeSlug = (p.productType || "").toLowerCase().replace(/\s+/g, '-');
    const catSlug = (p.category || "").toLowerCase().replace(/\s+/g, '-');
    const matSlug = (p.material || "").toLowerCase().replace(/\s+/g, '-');

    if (typeSlug === searchSlug) return true;
    if (catSlug === searchSlug || matSlug === searchSlug) return true;
    if (searchSlug.includes("oro-18") && matSlug.includes("oro-18")) return true;

    return false;
  });

  const titulo = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-serif text-magnolia-dark mb-10">
          {titulo}
        </h1>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-xl">{"No hay productos en \"" + titulo + "\" por el momento."}</p>
            <p className="mt-4 text-sm">Pronto agregaremos más joyas hermosas 💍</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group block border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/producto/${product.id}`} className="block">
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={product.imageUrl || '/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                    {/* PRECIO CORREGIDO AQUÍ */}
                    <p className="text-xl font-light text-gray-800">
                      ${(Number(product.price) * 1000).toLocaleString('es-AR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}
                    </p>
                  </div>
                </Link>
                <div className="px-4 pb-4 flex gap-3 justify-end">
                  <WishlistButton product={product} />
                  <AddToCartButton product={product} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}