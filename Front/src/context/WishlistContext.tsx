"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
};

type WishlistContextType = {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Cargar de memoria al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("magnolia-wishlist");
    if (saved) {
      setWishlistItems(JSON.parse(saved));
    }
  }, []);

  // Guardar en memoria al cambiar
  useEffect(() => {
    localStorage.setItem("magnolia-wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        // Si ya está, lo sacamos (Remove)
        return prev.filter((item) => item.id !== product.id);
      } else {
        // Si no está, lo agregamos (Add)
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (id: number) => {
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