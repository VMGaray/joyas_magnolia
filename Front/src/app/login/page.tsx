import Link from "next/link";
import { LoginForm } from "@/components/Login/LoginForm"; 

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Renderizamos el componente del formulario */}
      <LoginForm />
      
      {/* Botón de volver (puede estar aquí o dentro del componente, según prefieras) */}
      <Link href="/" className="mt-8 text-sm text-gray-400 hover:text-magnolia-dark transition-colors">
        ← Volver a la tienda
      </Link>

    </main>
  );
}