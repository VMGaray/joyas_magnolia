'use client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-magnolia-dark text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin</h2>
        <nav className="space-y-4">
          <a href="/admin" className="block hover:text-magnolia-lilac">Dashboard</a>
          <a href="/admin/productos" className="block hover:text-magnolia-lilac">Productos</a>
          <a href="/admin/pedidos" className="block hover:text-magnolia-lilac">Pedidos</a>
          <a href="/admin/usuarios" className="block hover:text-magnolia-lilac">Usuarios</a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
