import { User, Package, Lock, LogOut } from "lucide-react";

interface SidebarProps {
  displayName: string;
  displayEmail: string;
  activeTab: "profile" | "orders" | "security";
  setActiveTab: (tab: "profile" | "orders" | "security") => void;
  logout: () => void;
}

export const ProfileSidebar = ({
  displayName,
  displayEmail,
  activeTab,
  setActiveTab,
  logout,
}: SidebarProps) => {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white border border-gray-100 rounded-lg p-4 sticky top-24 shadow-sm">
        <div className="mb-6 px-4 pt-2">
          <h2 className="font-serif text-xl text-gray-900 truncate">Hola, {displayName.split(" ")[0]}</h2>
          <p className="text-xs text-gray-400 truncate mt-1">{displayEmail}</p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-md ${
              activeTab === "profile"
                ? "bg-purple-50 text-purple-700 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <User size={18} />
            Mis Datos
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-md ${
              activeTab === "orders"
                ? "bg-purple-50 text-purple-700 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Package size={18} />
            Mis Compras
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-md ${
              activeTab === "security"
                ? "bg-purple-50 text-purple-700 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Lock size={18} />
            Seguridad
          </button>

          <hr className="my-3 border-gray-100" />

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-md"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </aside>
  );
};
