"use client";

import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { notifyCart } from "@/components/helpers/Toast"; // 👈 importamos el helper

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    notifyCart(`"${product.name}" agregado al carrito 🛒`); // 👈 toast de feedback
  };

  return (
    <button 
      onClick={handleAddToCart}
      className="flex-1 bg-magnolia-dark text-white h-12 flex items-center justify-center gap-2 uppercase tracking-widest text-sm hover:bg-magnolia-lilac transition-colors"
    >
      <ShoppingCart size={18} />
      Agregar al Carrito
    </button>
  );
}
