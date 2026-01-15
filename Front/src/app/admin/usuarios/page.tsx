'use client';

import ListaUsuarios from "@/components/Admin/ListaUsuarios";

export default function UsuariosPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
      <ListaUsuarios />
    </div>
  );
}
