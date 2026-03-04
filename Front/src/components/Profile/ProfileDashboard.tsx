"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileForm } from "./ProfileForm";
import { OrdersList } from "./OrdersList";
import { SecuritySettings } from "./SecuritySettings";

export interface UserData {
  username?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string; // ✅ Agregado
  zip?: string;  // ✅ Agregado
}

export const ProfileDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "security">("profile");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al leer datos del usuario:", error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] w-full">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  const displayName = userData?.username || "Usuario";
  const displayEmail = userData?.email || "email@ejemplo.com";

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 min-h-[600px] font-sans">
      <ProfileSidebar
        displayName={displayName}
        displayEmail={displayEmail}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logout={logout}
      />

      <main className="flex-1 bg-white border border-gray-100 rounded-lg p-6 md:p-8 shadow-sm">
        {activeTab === "profile" && (
          <ProfileForm
            userData={userData}
            onSaved={(updated) => {
              setUserData(updated);
              localStorage.setItem("user", JSON.stringify(updated));
            }}
          />
        )}
        {activeTab === "orders" && <OrdersList />}
        {activeTab === "security" && <SecuritySettings />}
      </main>
    </div>
  );
};
