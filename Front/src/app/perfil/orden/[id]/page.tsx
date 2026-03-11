"use client";

import { useOrder } from "@/lib/hooks";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Package, Truck, Calendar, DollarSign, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// --- CONSTANTES DE CONFIGURACIÓN (Deben estar aquí arriba) ---
const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PROCESSED: "Procesado",
  SHIPPED: "Enviado",
  CANCELLED: "Cancelado",
  COMPLETED: "Completado",
};

const statusDescriptions: Record<string, string> = {
  PENDING: "Tu orden está siendo procesada",
  PROCESSED: "Tu orden ha sido procesada y próximamente será enviada",
  SHIPPED: "Tu orden está en camino",
  CANCELLED: "Tu orden fue cancelada",
  COMPLETED: "Tu orden ha sido entregada",
};

const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
  PENDING: { bg: "bg-yellow-50", text: "text-yellow-700", icon: "text-yellow-500" },
  PROCESSED: { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-500" },
  SHIPPED: { bg: "bg-green-50", text: "text-green-700", icon: "text-green-500" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-700", icon: "text-red-500" },
  COMPLETED: { bg: "bg-green-50", text: "text-green-700", icon: "text-green-500" },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const { order, isLoading, isError } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Loader2 size={40} className="animate-spin mb-2" />
        <p>Cargando detalles...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="bg-white rounded-lg p-12 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-serif text-magnolia-dark mb-2">Aún no tenés compras</h3>
        <p className="text-gray-500 mb-6 max-w-xs">
          Cuando realices tu primer pedido, aparecerá aquí.
        </p>
        <Link href="/" className="bg-magnolia-dark text-white px-8 py-3 rounded-sm uppercase tracking-widest text-xs hover:bg-magnolia-lilac transition-colors">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  // ✅ Ahora estas constantes existen y TypeScript no dará error
  const status = order.status as keyof typeof statusLabels;
  const statusColor = statusColors[status] || statusColors.PENDING;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-magnolia-dark transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Volver al historial
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="font-serif text-3xl text-magnolia-dark mb-2">Detalle del Pedido</h1>
              <p className="text-gray-500 text-sm">ID: {orderId.slice(0, 8).toUpperCase()}...</p>
            </div>
            <div className={`${statusColor.bg} ${statusColor.text} px-4 py-2 rounded-lg text-center`}>
              <p className="font-semibold text-lg">{statusLabels[status]}</p>
              <p className="text-xs mt-1">{statusDescriptions[status]}</p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <div className="text-sm">
                <p className="text-gray-500">Fecha de orden</p>
                <p className="font-medium text-gray-800">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <Package size={20} />
                Productos
              </h2>

              <div className="space-y-4">
                {order.items?.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product?.imageUrl || "/placeholder.jpg"}
                        alt={item.product?.name || "Producto"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-gray-800 mb-1">{item.product?.name}</h3>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      <p className="text-sm text-gray-500">
                        {/* ✅ PRECIO LIMPIO SIN MULTIPLICAR */}
                        Precio unitario: ${Number(item.price).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ${(Number(item.price) * item.quantity).toLocaleString("es-AR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                Resumen
              </h2>
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-bold text-lg text-magnolia-dark">
                    {/* ✅ TOTAL LIMPIO SIN MULTIPLICAR */}
                    ${Number(order.totalPrice).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}