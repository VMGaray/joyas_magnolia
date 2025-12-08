import { ProfileDashboard } from "@/components/Profile/ProfileDashboard";

export default function ProfilePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb (Ruta de navegación) */}
        <div className="mb-8 text-sm text-gray-500">
            <span>Inicio</span> / <span className="text-gray-900 font-medium">Mi Perfil</span>
        </div>

        {/* Aquí cargamos el tablero que creamos en components */}
        <ProfileDashboard />

      </div>
    </div>
  );
}