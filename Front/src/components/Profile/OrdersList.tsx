import { Package } from "lucide-react";
import Link from "next/link";

export const OrdersList = () => {
  // Si aún no integras con backend, muestra vacío. Luego puedes mapear pedidos.
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="font-serif text-2xl text-gray-900 mb-6 border-b border-gray-100 pb-4">
        Historial de Compras
      </h3>

      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Package className="text-gray-300" size={32} />
        </div>
        <p className="text-gray-600 font-medium text-lg mb-1">Aún no has realizado ninguna compra.</p>
        <p className="text-gray-400 text-sm mb-6 max-w-sm text-center">
          Tus pedidos aparecerán aquí una vez que confirmes tu primera compra.
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-white border border-purple-200 text-purple-700 font-bold rounded-md hover:bg-purple-50 text-xs uppercase tracking-widest transition-colors"
        >
          Ir a la tienda
        </Link>
      </div>
    </div>
  );
};
