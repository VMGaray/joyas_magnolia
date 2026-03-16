"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./AuthContext";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  removeOne: (id: string) => void;
  clearCart: () => void; // ✅ Limpieza para el Success
  totalPrice: number;
  totalItems: number;
  isCartOpen: boolean;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  
  // ✅ Usamos una función de inicialización para evitar el error del useEffect
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("magnolia-cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sincronizar con LocalStorage y manejar sesión
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("magnolia-cart", JSON.stringify(items));
    } else if (items.length > 0) {
      // Si se cierra sesión, limpiamos
      setItems([]);
      localStorage.removeItem("magnolia-cart");
    }
  }, [items, isLoggedIn]);

  const addToCart = (product: any) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === String(product.id));
      if (existing) {
        return prev.map((item) =>
          item.id === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, id: String(product.id), quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeOne = (id: string) => {
    setItems((prev) => {
      return prev.map((item) => 
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ).filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Limpieza total del carrito
 const clearCart = useCallback(() => {
  setItems([]);
  localStorage.removeItem("magnolia-cart");
}, []); // ✅ Esto hace que la función sea estable

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // ✅ Memorizamos los totales para mejorar performance
  // src/context/CartContext.tsx

const totalPrice = useMemo(() => {
  return items.reduce((acc, item) => {
    const itemPrice = Number(item.price) || 0;
    return acc + (itemPrice * item.quantity);
  }, 0);
}, [items]);
  const totalItems = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, removeOne, clearCart, totalPrice, totalItems, isCartOpen, toggleCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
}