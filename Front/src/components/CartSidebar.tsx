"use client";

import { useCart } from "../context/CartContext";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowLeft } from "lucide-react"; // Importamos flechas y signos
import Image from "next/image";
import Link from "next/link"; // Necesario para redirigir

export default function CartSidebar() {
  const { isCartOpen, toggleCart, items, removeFromCart, addToCart, removeOne, totalPrice } = useCart();

  return (
    <>
      {/* FONDO OSCURO */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={toggleCart}
        />
      )}

      {/* PANEL DEL CARRITO */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* CABECERA */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-magnolia-light">
            <h2 className="font-serif text-xl text-magnolia-dark flex items-center gap-2">
              <ShoppingBag size={20} />
              Tu Carrito
            </h2>
            <button onClick={toggleCart} className="text-gray-500 hover:text-red-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* LISTA DE PRODUCTOS */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <ShoppingBag size={48} className="opacity-20" />
                <p>Tu carrito está vacío.</p>
                {/* Botón Seguir Comprando (Vacío) */}
                <button onClick={toggleCart} className="text-magnolia-dark underline text-sm hover:text-magnolia-lilac">
                    Empezar a comprar
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  
                  {/* FOTO */}
                  <div className="relative w-20 h-20 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  {/* INFO + CONTROLES */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    
                    {/* Nombre y Tacho */}
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-sm text-gray-800 line-clamp-1 pr-2">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Controles de Cantidad y Precio */}
                    <div className="flex justify-between items-end mt-2">
                      
                      {/* Selector de Cantidad */}
                      <div className="flex items-center border border-gray-200 rounded-sm h-8">
                        <button 
                            onClick={() => removeOne(item.id)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <Minus size={12} />
                        </button>
                        
                        <span className="w-8 text-center text-xs font-medium text-gray-700">
                            {item.quantity}
                        </span>

                        <button 
                            onClick={() => addToCart(item)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <Plus size={12} />
                        </button>
                      </div>

                      {/* Precio Total del Item */}
                      <span className="font-medium text-magnolia-dark text-sm">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PIE DE CARRITO (TOTAL + BOTONES) */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              
              <div className="flex justify-between items-center mb-6">
                <span className="font-sans text-gray-600">Subtotal</span>
                <span className="font-serif text-xl font-bold text-magnolia-dark">
                  ${totalPrice.toLocaleString("es-AR")}
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                <Link 
                   href="/checkout" 
                   onClick={toggleCart} // Cerramos el sidebar al irnos
                   className="block w-full text-center bg-magnolia-dark text-white py-4 uppercase tracking-widest text-sm hover:bg-magnolia-lilac transition-colors font-bold shadow-lg"
                   > Iniciar Compra
                </Link>

                {/* Botón Seguir Comprando */}
                <button 
                    onClick={toggleCart} // Solo cierra el carrito y te deja donde estabas (o podés usar Link a /)
                    className="w-full border border-gray-300 text-gray-600 py-3 uppercase tracking-widest text-xs hover:border-magnolia-dark hover:text-magnolia-dark transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={14} />
                    Seguir Comprando
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}