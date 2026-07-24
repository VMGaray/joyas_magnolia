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
  rings_subtype?: string | null;
  earrings_subtype?: string | null;
  chains_subtype?: string | null;
  bracelets_subtype?: string | null;
  pendants_subtype?: string | null;
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

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<{ type?: string; subtype?: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.categoria;
  const { type: typeFilter, subtype: subtypeFilter } = await searchParams;

  const allProducts = await getAllProducts();

  const products = allProducts.filter(p => {
    const searchSlug = slug.toLowerCase();

    // Obtener strings para categoría y tipo de producto (ya que pueden venir como objetos o enums)
    const categoryName = typeof p.category === 'string' ? p.category : (p.category as any)?.name || "";
    const typeName = typeof p.productType === 'string' ? p.productType : (p.productType as any)?.name || "";

    const typeSlug = typeName.toLowerCase().replace(/\s+/g, '-');

    // Coincidencia con tipo de producto (anillos, aros, etc.) o con metal/categoría
    const slugToCategoryMap: Record<string, string[]> = {
      'plata-925': ['plata 925'],
      'oro-18k': ['oro 18k'],
      'oro-18kl': ['oro 18k'],
      'enchapado': ['enchapados'],
      'enchapados': ['enchapados'],
      'personalizados': ['personalizados'],
      'insumos': ['insumos']
    };

    const targetCategories = slugToCategoryMap[searchSlug] || [searchSlug];
    const isCategoryMatch = targetCategories.some(
      cat => cat.toLowerCase() === categoryName.toLowerCase()
    );

    // Fallback por compatibilidad con material si el backend o datos locales lo proveen
    const materialName = typeof (p as any).material === 'string' ? (p as any).material : "";
    const matSlug = materialName.toLowerCase().replace(/\s+/g, '-');

    const isBaseMatch =
      typeSlug === searchSlug ||
      isCategoryMatch ||
      matSlug === searchSlug ||
      // Caso especial para Oro 18k / Oro 18kl
      (searchSlug.includes("oro-18") && (categoryName.toLowerCase().includes("oro-18") || materialName.toLowerCase().includes("oro-18")));

    if (!isBaseMatch) return false;

    // Filtro adicional por tipo de producto (query param ?type=), aplicado cuando el slug es el metal
    if (typeFilter && typeName.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }

    // Filtro adicional por subtipo (query param ?subtype=): coincide en cualquiera de las columnas de subtipo
    if (subtypeFilter) {
      const subtypes = [
        p.rings_subtype,
        p.earrings_subtype,
        p.chains_subtype,
        p.bracelets_subtype,
        p.pendants_subtype,
      ];
      const hasSubtype = subtypes.some(
        (s) => typeof s === 'string' && s.toLowerCase() === subtypeFilter.toLowerCase()
      );
      if (!hasSubtype) return false;
    }

    return true;
  });

  const tituloBase = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  const titulo = [tituloBase, typeFilter, subtypeFilter].filter(Boolean).join(' · ');

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
                    
                    {/* ✅ PRECIO CORREGIDO: Sin el * 1000 */}
                    <p className="text-xl font-light text-gray-800">
                      ${Number(product.price).toLocaleString('es-AR', {
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