'use client';

import { useState, useEffect } from "react";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "admin" | "cliente";
}

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

 useEffect(() => {
  const timer = setTimeout(() => {
    setUsuarios([
      { id: 1, nombre: "Victoria Garay", email: "victoria@ejemplo.com", rol: "admin" },
      { id: 2, nombre: "Juan Pérez", email: "juan@ejemplo.com", rol: "cliente" },
      { id: 3, nombre: "María López", email: "maria@ejemplo.com", rol: "cliente" },
      { id: 4, nombre: "Carlos Gómez", email: "carlos@ejemplo.com", rol: "cliente" },
    ]);
  }, 0);

  return () => clearTimeout(timer);
}, []);


  if (!usuarios.length) return <p className="p-6">No hay usuarios registrados</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td className="border px-4 py-2">{u.id}</td>
              <td className="border px-4 py-2">{u.nombre}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    u.rol === "admin" ? "bg-purple-600" : "bg-gray-600"
                  }`}
                >
                  {u.rol}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
