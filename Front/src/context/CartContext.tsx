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
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  isCartOpen: boolean;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // ✅ Usamos una clave dinámica basada en el usuario (si existe) o una genérica
  const cartKey = user ? `magnolia-cart-${user.id}` : "magnolia-cart-guest";

  const [items, setItems] = useState<CartItem[]>([]);

  // 1. Cargar del LocalStorage al montar el componente o cambiar de usuario
  useEffect(() => {
    const saved = localStorage.getItem(cartKey);
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems([]);
    }
  }, [cartKey]);

  // 2. Guardar en LocalStorage cada vez que cambian los items
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(cartKey, JSON.stringify(items));
    } else {
      localStorage.removeItem(cartKey);
    }
  }, [items, cartKey]);

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

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(cartKey);
  }, [cartKey]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

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