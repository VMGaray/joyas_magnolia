"use client";

import { useCart } from "../context/CartContext";
import { X, Trash2, ShoppingBag, Plus, Minus, Sparkles, ArrowLeft } from "lucide-react"; 
import Image from "next/image";
import Link from "next/link"; 

export default function CartSidebar() {
  const { isCartOpen, toggleCart, items, removeFromCart, addToCart, removeOne, totalPrice } = useCart();

  // --- CONFIGURACIÓN DE PROMOS ---
  const PROMO_SILVER = 80000;
  const PROMO_PLATINUM = 120000;

  let descuento = 0;
  let etiquetaDescuento = "";
  let porcentajeDcto = 0;

  if (totalPrice >= PROMO_PLATINUM) {
    porcentajeDcto = 0.15;
    descuento = totalPrice * porcentajeDcto;
    etiquetaDescuento = "15% OFF PLATINUM";
  } else if (totalPrice >= PROMO_SILVER) {
    porcentajeDcto = 0.10;
    descuento = totalPrice * porcentajeDcto;
    etiquetaDescuento = "10% OFF SILVER";
  }

  const finalTotal = totalPrice - descuento;

  const getProgressData = () => {
    if (totalPrice >= PROMO_PLATINUM) {
      return { color: "#9D7B9E", percent: 100, label: "¡MÁXIMO DESCUENTO ALCANZADO!", msg: "¡Disfrutá tu 15% OFF!" };
    }
    if (totalPrice >= PROMO_SILVER) {
      const falta = PROMO_PLATINUM - totalPrice;
      return { 
        color: "#7B9E7D", 
        percent: (totalPrice / PROMO_PLATINUM) * 100, 
        label: "¡10% OFF ACTIVADO!", 
        msg: `Sumá $${falta.toLocaleString("es-AR")} para el 15% OFF` 
      };
    }
    const falta = PROMO_SILVER - totalPrice;
    return { 
      color: "#D8C8D9", 
      percent: (totalPrice / PROMO_SILVER) * 100, 
      label: "PRÓXIMO OBJETIVO: 10% OFF", 
      msg: `Estás a $${falta.toLocaleString("es-AR")} del primer descuento` 
    };
  };

  const progress = getProgressData();

  return (
    <>
      {isCartOpen && <div className="fixed inset-0 bg-black/50 z-[60]" onClick={toggleCart} />}

      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="font-serif text-xl text-magnolia-dark flex items-center gap-2 uppercase tracking-tighter">
              <ShoppingBag size={20} /> Mi Carrito
            </h2>
            <button onClick={toggleCart} className="text-gray-400 hover:text-red-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length > 0 && (
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: progress.color }}>
                    {progress.label}
                  </span>
                  <Sparkles size={14} style={{ color: progress.color }} className="animate-pulse" />
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${progress.percent}%`, backgroundColor: progress.color }} />
                </div>
                <p className="text-[11px] font-serif italic text-gray-500 text-center">{progress.msg}</p>
              </div>
            )}

            {items.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 font-serif italic">Tu carrito está esperando una joya...</p>
                <Link href="/" onClick={toggleCart} className="mt-4 inline-block text-xs uppercase tracking-widest text-magnolia-dark font-bold underline">
                  Ir a ver productos
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-6">
                  <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button onClick={() => removeOne(item.id)} className="px-2 py-1 hover:bg-gray-50"><Minus size={12} /></button>
                        <span className="px-2 text-xs font-bold w-8 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="px-2 py-1 hover:bg-gray-50"><Plus size={12} /></button>
                      </div>
                      <span className="text-sm font-black text-magnolia-dark">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-8 border-t border-gray-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                  <span className="text-gray-800 font-bold">${totalPrice.toLocaleString("es-AR")}</span>
                </div>

                {descuento > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#7B9E7D] uppercase tracking-widest text-[10px] font-black">{etiquetaDescuento}</span>
                    <span className="text-[#7B9E7D] font-black">- ${descuento.toLocaleString("es-AR")}</span>
                  </div>
                )}

                <div className="h-px bg-gray-50 my-2"></div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-black uppercase tracking-[0.2em] text-xs">Total</span>
                  <span className="text-2xl font-black text-magnolia-dark">
                    ${Math.round(finalTotal).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link 
                  href="/checkout" 
                  onClick={toggleCart} 
                  className="block w-full text-center bg-magnolia-dark text-white py-5 uppercase tracking-[0.3em] text-[10px] font-black hover:bg-magnolia-lilac transition-all shadow-xl active:scale-[0.98]"
                >
                  Finalizar Compra
                </Link>

                <button 
                  onClick={toggleCart}
                  className="w-full flex items-center justify-center gap-2 py-3 text-gray-400 hover:text-magnolia-dark transition-colors uppercase tracking-[0.2em] text-[9px] font-bold"
                >
                  <ArrowLeft size={14} /> Seguir Comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}