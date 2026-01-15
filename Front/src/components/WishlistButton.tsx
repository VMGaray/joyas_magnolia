"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { notifyWishlist } from "@/components/helpers/Toast"; // 👈 importamos helper

export default function WishlistButton({ product }: { product: any }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    toggleWishlist(product);

    if (isLiked) {
      notifyWishlist(`"${product.name}" eliminado de favoritos 💔`);
    } else {
      notifyWishlist(`"${product.name}" agregado a favoritos ❤️`);
    }
  };

  return (
    <button 
      onClick={handleToggleWishlist}
      className={`w-12 h-12 border flex items-center justify-center transition-all duration-300 ${
        isLiked 
          ? "border-red-200 text-red-500 bg-red-50" 
          : "border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200"
      }`}
      title={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
    </button>
  );
}
