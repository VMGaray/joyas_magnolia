'use client';

import { Toaster, toast } from "react-hot-toast";

// Componente global que se monta una sola vez en tu layout
export function ToastProvider() {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '4px', // Bordes más rectos y elegantes como tu marca
          padding: '12px 24px',
        }
      }}
    />
  );
}

// Helpers reutilizables con los colores de Magnolia Joyas
export const notifySuccess = (message: string) =>
  toast.success(message, {
    style: {
      background: "#1A1A1A", // Magnolia Dark (Fondo oscuro premium)
      color: "#F3E8FF",      // Texto lila muy clarito
      border: "1px solid #A78BFA", // Borde Magnolia Lilac
      fontWeight: "500",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontSize: "10px",
    },
    iconTheme: {
      primary: "#A78BFA", // Icono Lila
      secondary: "#1A1A1A",
    },
  });

export const notifyError = (message: string) =>
  toast.error(message, {
    style: {
      background: "#FEF2F2", // Fondo rojo suave
      color: "#991B1B",      // Texto rojo oscuro
      border: "1px solid #FCA5A5",
      fontWeight: "600",
      fontSize: "12px",
    },
    iconTheme: {
      primary: "#EF4444",
      secondary: "#fff",
    },
  });

export const notifyCart = (message: string) =>
  toast.success(message, {
    style: {
      background: "#1A1A1A",
      color: "#D4AF37",      // Texto Dorado para el carrito
      border: "1px solid #D4AF37", // Borde Dorado
      fontWeight: "500",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontSize: "10px",
    },
    icon: "🛒",
  });

export const notifyWishlist = (message: string) =>
  toast.success(message, {
    style: {
      background: "#1A1A1A",
      color: "#F87171",      // Texto Coral
      border: "1px solid #F87171",
      fontWeight: "500",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontSize: "10px",
    },
    icon: "🤍",
  });