'use client';

import ListaPedidos from "@/components/Admin/ListaPedidos";

export default function PedidosPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Pedidos</h1>
      <ListaPedidos />
    </div>
  );
}
