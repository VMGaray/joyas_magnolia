'use client';

import { useState, useEffect, useCallback } from "react";
import { UserCircle, Loader2, AlertTriangle, ShieldOff, ShieldCheck, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { notifyError, notifySuccess } from "@/components/helpers/Toast";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // ✅ Usamos useCallback para que la función sea estable y se pueda llamar desde cualquier lado
  const fetchUsuarios = useCallback(async (nombre?: string, currentBatch = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Si hay nombre usamos /search, si no, la lista paginada normal
      const endpoint = nombre 
        ? `${API_URL}/auth/users/search?name=${nombre}&page=${currentBatch}&limit=10` 
        : `${API_URL}/auth/users?page=${currentBatch}&limit=10`;

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        const listaFinal = data.data || data.users || (Array.isArray(data) ? data : []);
        setUsuarios(listaFinal);
        setTotalPages(data.totalPages || 1);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // ✅ Efecto que reacciona al cambio de página
  useEffect(() => {
    fetchUsuarios(busqueda, page);
  }, [page, fetchUsuarios]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reiniciamos a la página 1 al buscar
    fetchUsuarios(busqueda, 1);
  };

  const handleToggleBlock = async (user: any) => {
    // 🛡️ Determinamos el estado basado en blockedAt (como vimos en tu DB)
    const estaBloqueado = user.blockedAt !== null && user.blockedAt !== undefined;
    const action = estaBloqueado ? 'unblock' : 'block';
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/${action}/${user.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error();
      
      notifySuccess(`Usuario ${estaBloqueado ? 'desbloqueado' : 'bloqueado'} con éxito`);
      
      // ✅ IMPORTANTE: Refrescamos los datos inmediatamente para ver el cambio
      await fetchUsuarios(busqueda, page);
    } catch (error) {
      notifyError("No se pudo realizar la acción. Verificá los permisos del servidor.");
    }
  };

  if (loading && usuarios.length === 0) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-magnolia-lilac" size={40} /></div>
  );

  return (
    <div className="space-y-6 font-sans">
      {/* BUSCADOR */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre..."
            className="w-full pl-10 pr-4 py-2 outline-none text-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-magnolia-dark text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-magnolia-lilac transition-colors">
          Buscar
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400">Usuario</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 text-center">Estado</th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold text-gray-400 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {usuarios.length === 0 ? (
               <tr>
                 <td colSpan={3} className="py-20 text-center text-gray-400 text-sm italic">No se encontraron usuarios</td>
               </tr>
            ) : usuarios.map((u) => {
              const isBlocked = u.blockedAt !== null && u.blockedAt !== undefined;
              
              return (
                <tr key={u.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserCircle size={24} className={isBlocked ? "text-red-300" : "text-gray-300"} />
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isBlocked ? "text-gray-400" : "text-gray-700"}`}>
                          {u.name || u.email?.split('@')[0]}
                        </span>
                        <span className="text-[11px] text-gray-400">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      isBlocked ? "bg-red-50 text-red-500 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"
                    }`}>
                      {isBlocked ? "Bloqueado" : "Activo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {(u.role !== 'ADMIN' && !u.isAdmin) && (
                      <button 
                        onClick={() => handleToggleBlock(u)}
                        className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase py-2 px-3 rounded-lg transition-all ${
                          isBlocked ? "text-green-600 hover:bg-green-50" : "text-red-500 hover:bg-red-50"
                        }`}
                      >
                        {isBlocked ? <><ShieldCheck size={16} /> Desbloquear</> : <><ShieldOff size={16} /> Bloquear</>}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <button 
            disabled={page === 1 || loading} 
            onClick={() => setPage(p => p - 1)} 
            className="text-[10px] font-bold uppercase text-gray-400 hover:text-magnolia-dark disabled:opacity-30 transition-colors"
          >
            Anterior
          </button>
          
          <span className="text-[11px] text-gray-400 uppercase font-medium">
            Página {page} de {totalPages}
          </span>
          
          <button 
            disabled={page >= totalPages || loading} 
            onClick={() => setPage(p => p + 1)} 
            className="text-[10px] font-bold uppercase text-gray-400 hover:text-magnolia-dark disabled:opacity-30 transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}