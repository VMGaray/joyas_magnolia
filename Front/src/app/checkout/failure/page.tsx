"use client";

import Link from "next/link";

export default function FailurePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-2xl font-serif text-red-600 mb-4">¡No se procesó tu pago!</h2>
      <p className="text-gray-600 mb-6">Tu orden fue rechazada.</p>
      <Link href="/perfil/ordenes" className="text-magnolia-dark underline">
        Ver mis órdenes
      </Link>
    </div>
  );
}

