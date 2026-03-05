"use client";

import React, { useState } from "react";
import { useOrders } from "@/lib/hooks";
import { 
  Loader2, 
  ChevronDown, 
  Package, 
  ExternalLink 
} from "lucide-react";
import { notifySuccess, notifyError } from "@/components/helpers/Toast";

interface Pedido {
  id: string;
  userId: string;
  status: "PENDING" | "PROCESSED" | "SHIPPED" | "CANCELLED" | "COMPLETED";
  totalPrice: number;
  createdAt: string;
  items?: any[];
}

export default function ListaPedidos() {
  const { orders, isLoading, mutate } = useOrders();
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const statusLabels: Record<string, string> = {
    PENDING: "Pendiente",
    PROCESSED: "Procesado",
    SHIPPED: "Enviado",
    CANCELLED: "Cancelado",
    COMPLETED: "Completado",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    PROCESSED: "bg-blue-100 text-blue-800 border border-blue-200",
    SHIPPED: "bg-purple-100 text-purple-800 border border-purple-200",
    CANCELLED: "bg-red-100 text-red-800 border border-red-200",
    COMPLETED: "bg-green-100 text-green-800 border border-green-200",
  };

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
      <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-4">
        <Loader2 size={24} className="animate-spin text-magnolia-lilac" />
        <span className="text-xs uppercase tracking-widest">Cargando listado...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 🟡 CABECERA DE LA TABLA Y FILTROS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100">
        <h2 className="text-md font-serif text-magnolia-dark">Listado de Órdenes</h2>
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Filtrar por:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-magnolia-lilac/20 outline-none font-bold text-gray-600"
          >
            <option value="todos">Todos</option>
            {Object.entries(statusLabels).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 text-sm">
          No hay órdenes recientes.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-100">
                <th className="px-6 py-4 text-left">Referencia</th>
                <th className="px-6 py-4 text-left">Cliente</th>
                <th className="px-6 py-4 text-left">Fecha</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-4 py-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pedidosFiltrados.map((pedido: Pedido) => (
                <React.Fragment key={pedido.id}>
                  <tr className={`transition-colors ${expandedOrderId === pedido.id ? "bg-magnolia-light/30" : "hover:bg-gray-50/50"}`}>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                      #{pedido.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">
                      {pedido.userId ? `ID: ${pedido.userId.slice(0, 8)}` : "Invitado"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(pedido.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-magnolia-dark">
                      ${(Number(pedido.totalPrice || 0) * 1000).toLocaleString("es-AR")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${statusColors[pedido.status]}`}>
                        {statusLabels[pedido.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setExpandedOrderId(expandedOrderId === pedido.id ? null : pedido.id)}
                        className={`p-2 rounded-full transition-all ${expandedOrderId === pedido.id ? "bg-magnolia-dark text-white" : "text-gray-400 hover:bg-gray-100"}`}
                      >
                        <ChevronDown size={16} className={`transition-transform duration-300 ${expandedOrderId === pedido.id ? "rotate-180" : ""}`} />
                      </button>
                    </td>
                  </tr>

                  {/* Fila Expandible */}
                  {expandedOrderId === pedido.id && (
                    <tr>
                      <td colSpan={6} className="px-8 py-6 bg-gray-50/30 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Detalle de Joyas</h4>
                            <div className="space-y-2">
                              {pedido.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 text-gray-300">
                                      {item.product?.imageUrl ? <img src={item.product.imageUrl} className="w-full h-full object-cover" /> : <Package size={16} />}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-gray-700">{item.product?.name || "Pieza Magnolia"}</span>
                                      <span className="text-[10px] text-gray-400">Cant: {item.quantity}</span>
                                    </div>
                                  </div>
                                  <span className="text-xs font-bold text-magnolia-dark">${(Number(item.price || 0) * 1000).toLocaleString("es-AR")}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Cambiar Estado</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(statusLabels).map(([status, label]) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(pedido.id, status)}
                                  disabled={updatingOrderId === pedido.id}
                                  className={`px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                    pedido.status === status
                                      ? "bg-magnolia-dark border-magnolia-dark text-white shadow-lg"
                                      : "bg-white border-gray-100 text-gray-400 hover:border-magnolia-lilac hover:text-magnolia-lilac"
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                              <span className="text-[9px] text-gray-300 font-mono">ID: {pedido.id}</span>
                              <button className="text-[10px] text-magnolia-lilac font-bold flex items-center gap-1 hover:underline">
                                Ver Recibo <ExternalLink size={12} />
                              </button>
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