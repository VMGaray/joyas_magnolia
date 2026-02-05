"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

type CartItem = {
  id: string; // UUID
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  removeOne: (id: string) => void; // <--- NUEVA FUNCIÓN
  totalPrice: number;
  totalItems: number;
  isCartOpen: boolean;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Solo cargar carrito si está logueado
    if (isLoggedIn) {
      const savedCart = localStorage.getItem("magnolia-cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } else {
      // Limpiar carrito si no está logueado
      setItems([]);
      localStorage.removeItem("magnolia-cart");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("magnolia-cart", JSON.stringify(items));
  }, [items]);

  // SUMAR (Si ya existe suma 1, sino lo crea)
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

  // RESTAR DE A UNO (Nuevo)
  const removeOne = (id: string) => {
    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter((item) => item.quantity > 0); // Si llega a 0, se borra solo
    });
  };

  // ELIMINAR TODO EL ITEM (Tacho de basura)
  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, removeOne, totalPrice, totalItems, isCartOpen, toggleCart }}
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