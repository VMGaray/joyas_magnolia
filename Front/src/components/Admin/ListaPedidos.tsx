"use client";

import { useState, useEffect } from "react";
import { useOrders } from "@/lib/hooks";
import { Loader2, ChevronDown } from "lucide-react";
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

  // Mapear estados del backend al español
  const statusLabels: Record<string, string> = {
    PENDING: "Pendiente",
    PROCESSED: "Procesado",
    SHIPPED: "Enviado",
    CANCELLED: "Cancelado",
    COMPLETED: "Completado",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-200 text-black",
    PROCESSED: "bg-blue-200 text-blue-900",
    SHIPPED: "bg-green-700 text-white",
    CANCELLED: "bg-red-500 text-white",
    COMPLETED: "bg-green-600 text-white",
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
      notifySuccess("Estado actualizado correctamente");
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
      <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
        <Loader2 size={20} className="animate-spin" />
        <span>Cargando órdenes...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Filtro por estado */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-gray-600">Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-magnolia-lilac"
        >
          <option value="todos">Todos</option>
          <option value="PENDING">Pendiente</option>
          <option value="PROCESSED">Procesado</option>
          <option value="SHIPPED">Enviado</option>
          <option value="COMPLETED">Completado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>

      {/* Tabla de pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center text-gray-500">
          No hay órdenes que mostrar
        </div>
      ) : (
        <div className="border border-gray-300 rounded overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-magnolia-dark text-white">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Usuario ID</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido: Pedido) => (
                <tbody key={pedido.id}>
                  <tr className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{pedido.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-sm">{pedido.userId.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(pedido.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      ${Number(pedido.totalPrice).toLocaleString("es-AR")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold inline-block ${
                          statusColors[pedido.status] || "bg-gray-200"
                        }`}
                      >
                        {statusLabels[pedido.status] || pedido.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === pedido.id ? null : pedido.id
                          )
                        }
                        className="text-magnolia-dark hover:text-magnolia-lilac transition"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${
                            expandedOrderId === pedido.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </td>
                  </tr>

                  {/* Detalles expandibles */}
                  {expandedOrderId === pedido.id && (
                    <tr className="border-t border-gray-200 bg-gray-50">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="space-y-4">
                          {/* Items de la orden */}
                          {pedido.items && pedido.items.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-2">
                                Productos:
                              </h4>
                              <div className="space-y-2 ml-4">
                                {pedido.items.map((item: any, idx: number) => (
                                  <div key={idx} className="text-sm text-gray-600">
                                    <p>
                                      {item.product?.name || "Producto"} x{item.quantity}{" "}
                                      - ${Number(item.price).toLocaleString("es-AR")}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Cambiar estado */}
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">
                              Cambiar estado:
                            </label>
                            <div className="flex gap-2 flex-wrap">
                              {["PENDING", "PROCESSED", "SHIPPED", "COMPLETED", "CANCELLED"].map(
                                (status) => (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusChange(pedido.id, status)}
                                    disabled={updatingOrderId === pedido.id}
                                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                                      pedido.status === status
                                        ? "bg-magnolia-dark text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    } ${updatingOrderId === pedido.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                  >
                                    {updatingOrderId === pedido.id ? (
                                      <Loader2 size={12} className="inline animate-spin mr-1" />
                                    ) : null}
                                    {statusLabels[status]}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
