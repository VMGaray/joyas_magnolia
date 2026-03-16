"use client";

import { ForgotPassword } from "@/components/Auth/ForgotPassword";

export default function RecuperarClavePage() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      {/* Este contenedor asegura que el formulario se vea 
          centrado y elegante en cualquier dispositivo 
      */}
      <div className="w-full max-w-md">
        <ForgotPassword />
      </div>
    </main>
  );
}