'use client';

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

 useEffect(() => {
  const timer = setTimeout(() => {
    setPedidos([
      { id: 1, usuario: "Juan Pérez", fecha: "2026-01-10", total: "$12000", estado: "pendiente" },
      { id: 2, usuario: "María López", fecha: "2026-01-12", total: "$8500", estado: "procesado" },
      { id: 3, usuario: "Carlos Gómez", fecha: "2026-01-13", total: "$4500", estado: "enviado" },
      { id: 4, usuario: "Ana Torres", fecha: "2026-01-14", total: "$2200", estado: "cancelado" },
    ]);
  }, 0);

  return () => clearTimeout(timer);
}, []);


  if (!pedidos.length) return <p className="p-6">No hay pedidos registrados</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Usuario</th>
            <th className="border px-4 py-2">Fecha</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.id}</td>
              <td className="border px-4 py-2">{p.usuario}</td>
              <td className="border px-4 py-2">{p.fecha}</td>
              <td className="border px-4 py-2">{p.total}</td>
              <td className="border px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    p.estado === "pendiente"
                      ? "bg-yellow-500"
                      : p.estado === "procesado"
                      ? "bg-blue-500"
                      : p.estado === "enviado"
                      ? "bg-green-500"
                      : "bg-red-500"
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
