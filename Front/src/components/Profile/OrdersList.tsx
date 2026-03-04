import { Package, Loader2, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useOrders } from "@/lib/hooks";

interface Order {
  id: string;
  status: "PENDING" | "PROCESSED" | "SHIPPED" | "CANCELLED" | "COMPLETED";
  totalPrice: number;
  createdAt: string;
  items?: any[];
}

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PROCESSED: "Procesado",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
  COMPLETED: "Completado",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
};

export const OrdersList = () => {
  const { orders, isLoading, isError } = useOrders();

  const userOrders = Array.isArray(orders) ? orders : [];

  if (isLoading) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h3 className="font-serif text-2xl text-gray-900 mb-6 border-b border-gray-100 pb-4">
          Historial de Compras
        </h3>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-magnolia-lilac" size={32} />
        </div>
      </div>
    );
  }

  // Si hay error o no hay órdenes, mostramos un estado vacío amigable
  if (isError || userOrders.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h3 className="font-serif text-2xl text-gray-900 mb-6 border-b border-gray-100 pb-4">
          Historial de Compras
        </h3>
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <ShoppingBag className="text-gray-300" size={32} />
          </div>
          <p className="text-gray-600 font-medium text-lg mb-1">Aún no has realizado ninguna compra.</p>
          <p className="text-gray-400 text-sm mb-6 max-w-sm text-center">
            Tus pedidos aparecerán aquí una vez que confirmes tu primera compra.
          </p>
          <Link
            href="/"
            className="px-8 py-3 bg-magnolia-dark text-white font-bold rounded-sm hover:bg-magnolia-lilac text-xs uppercase tracking-widest transition-colors shadow-md"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="font-serif text-2xl text-gray-900 mb-6 border-b border-gray-100 pb-4">
        Historial de Compras
      </h3>

      <div className="space-y-4">
        {userOrders.map((order: Order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500 italic">Pedido ID: #{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm text-gray-600 font-medium">
                  {new Date(order.createdAt).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter font-bold ${
                  statusColors[order.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {statusLabels[order.status] || order.status}
              </span>
            </div>

            {/* Detalles rápidos de productos */}
            {order.items && order.items.length > 0 && (
              <div className="mb-3 text-sm">
                <ul className="space-y-1 text-gray-500">
                  {order.items.map((item: any, idx: number) => (
                    <li key={idx} className="flex gap-2 items-center">
                      <div className="w-1 h-1 bg-gray-300 rounded-full" />
                      {item.product?.name || "Producto"} <span className="text-xs text-gray-400">(x{item.quantity})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Total y acciones */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <p className="font-bold text-magnolia-dark">
                {/* PRECIO CORREGIDO (* 1000) */}
                Total: ${(Number(order.totalPrice) * 1000).toLocaleString("es-AR", {
                  minimumFractionDigits: 0,
                })}
              </p>
              <Link
                href={`/perfil/orden/${order.id}`}
                className="text-magnolia-lilac hover:text-magnolia-dark text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                Ver detalles <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pequeño helper para el icono del final
const ChevronRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);