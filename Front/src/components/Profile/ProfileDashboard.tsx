"use client";

import { useState } from "react";
import { User, Package, MapPin, Lock, LogOut } from "lucide-react";

export const ProfileDashboard = () => {
  // Estado para saber qué pestaña está activa
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "security">("profile");

  const handleLogout = () => {
    // Aquí luego pondremos la lógica para borrar el token
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
      
      {/* --- SIDEBAR (Menú Lateral) --- */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white border border-gray-100 rounded-sm p-4 sticky top-24">
          
          <div className="mb-6 px-4">
            <h2 className="font-serif text-xl text-magnolia-dark">Hola, Victoria</h2>
            <p className="text-xs text-gray-400">victoria@mail.com</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-sm ${
                activeTab === "profile" 
                  ? "bg-magnolia-lilac/10 text-magnolia-dark font-medium" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <User size={18} />
              Mis Datos
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-sm ${
                activeTab === "orders" 
                  ? "bg-magnolia-lilac/10 text-magnolia-dark font-medium" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Package size={18} />
              Mis Compras
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-sm ${
                activeTab === "security" 
                  ? "bg-magnolia-lilac/10 text-magnolia-dark font-medium" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Lock size={18} />
              Seguridad
            </button>

            <hr className="my-2 border-gray-100" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-50 transition-colors rounded-sm"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </aside>


      {/* --- CONTENIDO PRINCIPAL (Cambia según el click) --- */}
      <main className="flex-1 bg-white border border-gray-100 rounded-sm p-8">
        
        {/* Pestaña: MIS DATOS */}
        {activeTab === "profile" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-serif text-2xl text-magnolia-dark mb-6 border-b border-gray-100 pb-4">
              Mis Datos Personales
            </h3>
            
            <form className="space-y-6 max-w-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gray-500 mb-1">Nombre</label>
                  <input type="text" defaultValue="Victoria" className="w-full border border-gray-200 p-2 rounded-sm focus:border-magnolia-lilac outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-500 mb-1">Apellido</label>
                  <input type="text" defaultValue="Garay" className="w-full border border-gray-200 p-2 rounded-sm focus:border-magnolia-lilac outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">Teléfono</label>
                <input type="tel" defaultValue="+54 9 11 1234 5678" className="w-full border border-gray-200 p-2 rounded-sm focus:border-magnolia-lilac outline-none" />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-500 mb-1">Dirección de Envío</label>
                <input type="text" defaultValue="Calle Falsa 123, Depto 4" className="w-full border border-gray-200 p-2 rounded-sm focus:border-magnolia-lilac outline-none mb-2" />
                <div className="grid grid-cols-2 gap-4">
                   <input type="text" placeholder="Ciudad" className="w-full border border-gray-200 p-2 rounded-sm outline-none" />
                   <input type="text" placeholder="Código Postal" className="w-full border border-gray-200 p-2 rounded-sm outline-none" />
                </div>
              </div>

              <button className="bg-magnolia-dark text-white px-6 py-2 text-sm uppercase tracking-wider hover:bg-magnolia-lilac transition-colors">
                Guardar Cambios
              </button>
            </form>
          </div>
        )}


        {/* Pestaña: MIS COMPRAS */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-serif text-2xl text-magnolia-dark mb-6 border-b border-gray-100 pb-4">
              Historial de Compras
            </h3>
            
            {/* Ejemplo de cuando NO hay compras */}
            <div className="text-center py-12 bg-gray-50 rounded-sm">
                <Package className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Aún no has realizado ninguna compra.</p>
                <button className="mt-4 text-magnolia-lilac font-medium hover:underline text-sm">
                    Ir a la tienda
                </button>
            </div>
          </div>
        )}


        {/* Pestaña: SEGURIDAD */}
        {activeTab === "security" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <h3 className="font-serif text-2xl text-magnolia-dark mb-6 border-b border-gray-100 pb-4">
              Cambiar Contraseña
            </h3>
            
            <form className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-xs uppercase text-gray-500 mb-1">Contraseña Actual</label>
                  <input type="password" className="w-full border border-gray-200 p-2 rounded-sm focus:border-magnolia-lilac outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-500 mb-1">Nueva Contraseña</label>
                  <input type="password" className="w-full border border-gray-200 p-2 rounded-sm focus:border-magnolia-lilac outline-none" />
                </div>
                 <button className="bg-gray-800 text-white px-6 py-2 text-sm uppercase tracking-wider hover:bg-black transition-colors">
                    Actualizar Clave
                 </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};