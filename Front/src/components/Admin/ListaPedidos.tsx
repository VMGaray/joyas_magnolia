"use client";

import React, { useState } from "react";
import { useOrders } from "@/lib/hooks";
import { 
  Loader2, 
  ChevronDown, 
  Package, 
  MapPin, 
  Phone, 
  User, 
  CreditCard,
  Truck // ✅ Agregué Truck
} from "lucide-react";
import { notifySuccess, notifyError } from "@/components/helpers/Toast";

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

// ✅ Etiquetas amigables para los métodos de envío
const shippingLabels: Record<string, string> = {
  calamuchita: "Valle de Calamuchita (Gratis)",
  vgb: "Retiro en Local (VGB)",
  nacional: "Resto del País (A Coordinar)",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-600 border-yellow-200",
  PAID: "bg-green-100 text-green-600 border-green-200",
  SHIPPED: "bg-blue-100 text-blue-600 border-blue-200",
  DELIVERED: "bg-purple-100 text-purple-600 border-purple-200",
  CANCELLED: "bg-red-100 text-red-600 border-red-200",
};

export default function ListaPedidos() {
  const { orders, isLoading, mutate } = useOrders();
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const pedidosFiltrados = !Array.isArray(orders)
    ? []
    : filtroEstado === "todos" 
      ? orders 
      : orders.filter((p) => p.status?.toUpperCase() === filtroEstado);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/order/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }), 
      });

      if (!res.ok) throw new Error();
      
      notifySuccess(`Estado cambiado a ${statusLabels[newStatus]} ✨`);
      mutate();
    } catch (error) {
      notifyError("Error al actualizar: El servidor rechazó el cambio");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
      <Loader2 size={32} className="animate-spin text-magnolia-lilac" />
      <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Sincronizando Órdenes...</span>
    </div>
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold border-b border-gray-100">
              <th className="px-6 py-5 text-left">Ref.</th>
              <th className="px-6 py-5 text-left">Cliente</th>
              <th className="px-6 py-5 text-left">Total</th>
              <th className="px-6 py-5 text-left">Estado</th>
              <th className="px-6 py-5 text-center">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pedidosFiltrados.map((pedido: any) => (
              <React.Fragment key={pedido.id}>
                <tr className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-5 font-mono text-[11px] text-gray-400">
                    #{pedido.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-gray-700">
                    {pedido.userName || pedido.user?.username || pedido.user?.name || "Cliente Magnolia"}
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-magnolia-dark">
                    ${Number(pedido.totalAmount || pedido.totalPrice || 0).toLocaleString("es-AR")}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase border ${statusColors[pedido.status?.toUpperCase()] || "bg-gray-100 text-gray-500"}`}>
                      {statusLabels[pedido.status?.toUpperCase()] || pedido.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => setExpandedOrderId(expandedOrderId === pedido.id ? null : pedido.id)}
                      className="p-2 hover:bg-white rounded-full transition-shadow border border-transparent hover:border-gray-100"
                    >
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedOrderId === pedido.id ? "rotate-180" : ""}`} />
                    </button>
                  </td>
                </tr>

                {expandedOrderId === pedido.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 bg-gray-50/50 border-t border-gray-100">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        
                        {/* PRODUCTOS */}
                        <div className="lg:col-span-2 space-y-4">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Package size={14} /> Artículos del Pedido
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {pedido.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 text-gray-300">
                                  {item.product?.imageUrl || item.image ? (
                                    <img src={item.product?.imageUrl || item.image} className="w-full h-full object-cover" alt="Joya" />
                                  ) : (
                                    <Package size={20} />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-black text-gray-700 truncate">
                                    {item.product?.name || item.productName || item.name || `Producto #${item.id?.slice(0,5)}`}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Cant: {item.quantity}</p>
                                </div>
                                <div className="text-right text-xs font-black text-magnolia-dark">
                                  ${Number(item.price || 0).toLocaleString("es-AR")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ENTREGA Y GESTIÓN */}
                        <div className="space-y-4">
                          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div>
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <User size={14} /> Datos de Entrega
                              </h4>
                              
                              {/* ✅ NUEVO: MÉTODO DE ENVÍO RESALTADO */}
                              <div className={`mb-4 p-3 rounded-xl border flex items-center gap-3 ${pedido.shippingMethod === 'nacional' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                <Truck size={16} className={pedido.shippingMethod === 'nacional' ? 'text-red-500' : 'text-green-500'} />
                                <div>
                                  <p className="text-[9px] uppercase font-black text-gray-400 leading-none mb-1">Método elegido:</p>
                                  <p className={`text-[11px] font-black uppercase ${pedido.shippingMethod === 'nacional' ? 'text-red-600' : 'text-green-700'}`}>
                                    {shippingLabels[pedido.shippingMethod] || pedido.shippingMethod || "No especificado"}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex gap-3">
                                  <User size={14} className="text-gray-300 mt-0.5" />
                                  <p className="text-xs font-bold text-gray-700">
                                    {pedido.userName || pedido.user?.username || pedido.user?.name || "Sin nombre registrado"}
                                  </p>
                                </div>
                                <div className="flex gap-3">
                                  <MapPin size={14} className="text-gray-300 mt-0.5" />
                                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                    {pedido.shippingAddress || pedido.user?.address || "Dirección no especificada"}
                                  </p>
                                </div>
                                <div className="flex gap-3">
                                  <Phone size={14} className="text-gray-300 mt-0.5" />
                                  <a 
                                    href={`https://wa.me/${pedido.contactPhone || pedido.user?.phone}?text=Hola!%20Soy%20de%20Magnolia%20Joyas.%20Me%20contacto%20por%20tu%20pedido%20%23${pedido.id.slice(-6).toUpperCase()}`}
                                    target="_blank"
                                    className="text-xs font-black text-magnolia-dark hover:text-green-600 transition-colors flex items-center gap-1"
                                  >
                                    {pedido.contactPhone || pedido.user?.phone || "Sin teléfono"}
                                    <Phone size={10} />
                                  </a>
                                </div>
                              </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CreditCard size={14} /> Gestión de Estado
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {["PENDING", "PAID", "SHIPPED", "CANCELLED"].map((st) => (
                                  <button
                                    key={st}
                                    disabled={updatingOrderId === pedido.id}
                                    onClick={() => handleStatusChange(pedido.id, st)}
                                    className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border ${
                                      pedido.status?.toUpperCase() === st 
                                        ? "bg-magnolia-dark text-white border-magnolia-dark shadow-md" 
                                        : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"
                                    }`}
                                  >
                                    {updatingOrderId === pedido.id && (pedido.status?.toUpperCase() !== st) 
                                      ? <Loader2 size={10} className="animate-spin mx-auto" /> 
                                      : statusLabels[st]}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}