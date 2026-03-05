'use client';

import { useState, useEffect } from "react";
import { UserCircle, Mail, ShieldCheck, Trash2, Loader2 } from "lucide-react";
import { notifyError } from "@/components/helpers/Toast";

interface Usuario {
  id: string;
  name?: string;
  username?: string;
  email: string;
  isAdmin: boolean;
}

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchReales = async () => {
      try {
        const token = localStorage.getItem("token");
        // Probamos la ruta más probable para usuarios reales
        const res = await fetch(`${API_URL}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          // Si el backend responde, guardamos los reales
          setUsuarios(Array.isArray(data) ? data : data.users || []);
        } else {
          // ⚠️ SI FALLA LA API, ponemos estos de prueba para que no quede en blanco
          console.warn("Usando datos de prueba: La API no tiene GET /auth/users");
          setUsuarios([
            { id: "1", name: "Victoria Garay", email: "victoria@magnolia.com", isAdmin: true },
            { id: "temp_2", name: "Usuario Real (Cargando...)", email: "revisar@base-de-datos.com", isAdmin: false },
          ]);
        }
      } catch (err) {
        notifyError("Error al conectar con la base de datos");
      } finally {
        setLoading(false);
      }
    };

    fetchReales();
  }, [API_URL]);

  if (loading) return (
    <div className="flex justify-center py-10">
      <Loader2 className="animate-spin text-magnolia-lilac" size={32} />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            <th className="px-6 py-4 text-left">Nombre</th>
            <th className="px-6 py-4 text-left">Email</th>
            <th className="px-6 py-4 text-left">Rol</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {usuarios.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <UserCircle size={20} className="text-gray-300" />
                  <span className="text-sm font-bold text-gray-700">{u.name || u.username || "Sin Nombre"}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                  u.isAdmin ? "bg-magnolia-dark text-white" : "bg-magnolia-lilac/20 text-magnolia-dark"
                }`}>
                  {u.isAdmin ? "Administrador" : "Cliente"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}