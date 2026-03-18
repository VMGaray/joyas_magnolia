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
  CreditCard
} from "lucide-react";
import { notifySuccess, notifyError } from "@/components/helpers/Toast";

// --- CONSTANTES DE ESTILO ---
const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
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
    : orders.filter((p) => p.status === filtroEstado);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`${API_URL}/order/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Error al actualizar estado");
      notifySuccess("Estado actualizado correctamente ✨");
      mutate();
    } catch (error) {
      notifyError("Error al actualizar el estado");
      console.error(error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
        <Loader2 size={32} className="animate-spin text-magnolia-lilac" />
        <span className="text-xs uppercase tracking-[0.3em] font-bold">Sincronizando Órdenes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* FILTROS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["todos", "PENDING", "PAID", "SHIPPED", "CANCELLED"].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              filtroEstado === estado 
              ? "bg-magnolia-dark text-white border-magnolia-dark shadow-md" 
              : "bg-white text-gray-400 border-gray-100 hover:border-magnolia-lilac"
            }`}
          >
            {estado === "todos" ? "Ver Todo" : statusLabels[estado]}
          </button>
        ))}
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-20 text-center">
          <Package className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400 font-serif italic text-lg">No se encontraron pedidos en esta categoría</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-100">
                <th className="px-6 py-5 text-left">Ref.</th>
                <th className="px-6 py-5 text-left">Cliente</th>
                <th className="px-6 py-5 text-left">Fecha</th>
                <th className="px-6 py-5 text-left">Total</th>
                <th className="px-6 py-5 text-left">Estado</th>
                <th className="px-6 py-5 text-center">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pedidosFiltrados.map((pedido: any) => (
                <React.Fragment key={pedido.id}>
                  <tr className={`transition-colors ${expandedOrderId === pedido.id ? "bg-magnolia-lilac/5" : "hover:bg-gray-50/30"}`}>
                    <td className="px-6 py-5 font-mono text-[11px] text-gray-400 font-bold">
                      #{pedido.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-700">
                          {pedido.userName || (pedido.user?.username) || "Cliente Magnolia"}
                        </span>
                        <span className="text-[10px] text-gray-400 tracking-tighter">{pedido.user?.email || "Sin email registrado"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs text-gray-500 font-medium">
                      {new Date(pedido.createdAt).toLocaleDateString("es-AR", { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-magnolia-dark">
                      ${Number(pedido.totalAmount || pedido.totalPrice || 0).toLocaleString("es-AR")}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border ${statusColors[pedido.status]}`}>
                        {statusLabels[pedido.status]}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button 
                        onClick={() => setExpandedOrderId(expandedOrderId === pedido.id ? null : pedido.id)}
                        className="p-2 hover:bg-white rounded-full transition-shadow shadow-sm border border-transparent hover:border-gray-100"
                      >
                        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${expandedOrderId === pedido.id ? "rotate-180 text-magnolia-dark" : ""}`} />
                      </button>
                    </td>
                  </tr>

                  {/* --- FILA EXPANDIBLE REESTRUCTURADA --- */}
                  {expandedOrderId === pedido.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 bg-gray-50/50 border-t border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                          
                          {/* COLUMNA 1: PRODUCTOS (Ocupa 2/3 en desktop) */}
                          <div className="lg:col-span-2 space-y-4">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                              <Package size={14} /> Artículos del Pedido
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {pedido.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-50 flex-shrink-0">
                                    {item.product?.imageUrl ? (
                                      <img src={item.product.imageUrl} className="w-full h-full object-cover" alt="Joya" />
                                    ) : (
                                      <span className="text-gray-300 font-serif text-xl font-bold">M</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-gray-700 truncate">{item.product?.name || "Pieza Magnolia"}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Cant: {item.quantity}</p>
                                  </div>
                                  <div className="text-right text-xs font-black text-magnolia-dark">
                                    ${Number(item.price || 0).toLocaleString("es-AR")}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* COLUMNA 2: ENVÍO Y ESTADO (Ocupa 1/3) */}
                          <div className="space-y-4">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                              <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                  <MapPin size={14} /> Entrega y Contacto
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex gap-3">
                                    <User size={14} className="text-gray-300 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs font-bold text-gray-700">{pedido.userName || "Sin nombre registrado"}</p>
                                  </div>
                                  <div className="flex gap-3">
                                    <MapPin size={14} className="text-gray-300 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                      {pedido.shippingAddress || "Dirección no especificada"}
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <Phone size={14} className="text-gray-300 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs font-black text-magnolia-dark">{pedido.contactPhone || "Sin teléfono"}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-6 border-t border-gray-50">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                  <CreditCard size={14} /> Gestión de Orden
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {["PENDING", "PAID", "SHIPPED", "CANCELLED"].map((st) => (
                                    <button
                                      key={st}
                                      disabled={updatingOrderId === pedido.id}
                                      onClick={() => handleStatusChange(pedido.id, st)}
                                      className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border ${
                                        pedido.status === st 
                                        ? "bg-magnolia-dark text-white border-magnolia-dark" 
                                        : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"
                                      }`}
                                    >
                                      {updatingOrderId === pedido.id && pedido.status !== st ? <Loader2 size={10} className="animate-spin mx-auto" /> : statusLabels[st]}
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
      )}
    </div>
  );
}