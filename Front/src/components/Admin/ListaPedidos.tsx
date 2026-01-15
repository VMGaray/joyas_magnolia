"use client";

import { useState, useEffect } from "react";

interface Pedido {
  id: number;
  usuario: string;
  fecha: string;
  total: string;
  estado: "pendiente" | "procesado" | "enviado" | "cancelado";
}

export default function ListaPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");

  useEffect(() => {
    setPedidos([
      { id: 1, usuario: "Juan Pérez", fecha: "2026-01-10", total: "$12000", estado: "pendiente" },
      { id: 2, usuario: "María López", fecha: "2026-01-12", total: "$8500", estado: "procesado" },
      { id: 3, usuario: "Carlos Gómez", fecha: "2026-01-13", total: "$4500", estado: "enviado" },
      { id: 4, usuario: "Ana Torres", fecha: "2026-01-14", total: "$2200", estado: "cancelado" },
    ]);
  }, []);

  const pedidosFiltrados =
    filtroEstado === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroEstado);

  return (
    <div className="overflow-x-auto">
      {/* --- Filtro por estado --- */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-gray-600">Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-magnolia-lilac"
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="procesado">Procesado</option>
          <option value="enviado">Enviado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* --- Tabla de pedidos --- */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-magnolia-dark text-white">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Usuario</th>
            <th className="border px-4 py-2">Fecha</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.id}</td>
              <td className="border px-4 py-2">{p.usuario}</td>
              <td className="border px-4 py-2">{p.fecha}</td>
              <td className="border px-4 py-2">{p.total}</td>
              <td className="border px-4 py-2">
                <span
                  className={`px-2 py-1 rounded font-semibold ${
                    p.estado === "pendiente"
                      ? "bg-yellow-200 text-black"
                      : p.estado === "procesado"
                      ? "bg-magnolia-lilac text-magnolia-dark"
                      : p.estado === "enviado"
                      ? "bg-green-700 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {p.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
