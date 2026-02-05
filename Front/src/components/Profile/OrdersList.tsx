import { Package, Loader2, AlertCircle } from "lucide-react";
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

  // Filtrar solo las órdenes del usuario actual (el backend debería hacer esto con JWT)
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

  if (isError) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h3 className="font-serif text-2xl text-gray-900 mb-6 border-b border-gray-100 pb-4">
          Historial de Compras
        </h3>
        <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="text-red-500 mb-4" size={32} />
          <p className="text-red-700 font-medium">Error al cargar las órdenes</p>
        </div>
      </div>
    );
  }

  if (!userOrders || userOrders.length === 0) {
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
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500">Pedido ID: {order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  statusColors[order.status] || "bg-gray-100"
                }`}
              >
                {statusLabels[order.status] || order.status}
              </span>
            </div>

            {/* Detalles del pedido */}
            {order.items && order.items.length > 0 && (
              <div className="mb-3 text-sm">
                <p className="text-gray-600 font-medium mb-1">Productos:</p>
                <ul className="ml-4 space-y-1 text-gray-500">
                  {order.items.map((item: any, idx: number) => (
                    <li key={idx}>
                      {item.product?.name || "Producto"} x{item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Total y acciones */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <p className="font-semibold text-magnolia-dark">
                Total: ${Number(order.totalPrice).toLocaleString("es-AR")}
              </p>
              <Link
                href={`/perfil/orden/${order.id}`}
                className="text-magnolia-lilac hover:text-magnolia-dark text-sm font-medium transition"
              >
                Ver detalles →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
