"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

type WishlistContextType = {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // ✅ Clave dinámica: favoritos por usuario
  const wishlistKey = user ? `magnolia-wishlist-${user.id}` : "magnolia-wishlist-guest";

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Cargar de memoria al iniciar o cambiar usuario
  useEffect(() => {
    const saved = localStorage.getItem(wishlistKey);
    if (saved) {
      setWishlistItems(JSON.parse(saved));
    } else {
      setWishlistItems([]);
    }
  }, [wishlistKey]);

  // Guardar en memoria al cambiar items
  useEffect(() => {
    if (wishlistItems.length > 0) {
      localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
    } else {
      localStorage.removeItem(wishlistKey);
    }
  }, [wishlistItems, wishlistKey]);

  const toggleWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist debe usarse dentro de WishlistProvider");
  return context;
}