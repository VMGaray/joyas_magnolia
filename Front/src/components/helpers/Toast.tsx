'use client';

import { Toaster, toast } from "react-hot-toast";

// Componente global que se monta una sola vez en tu layout
export function ToastProvider() {
  return <Toaster position="top-right" />;
}

// Helpers reutilizables
export const notifySuccess = (message: string) =>
  toast.success(message, {
    style: {
      background: "#A78BFA", // lilac Magnolia
      color: "#3B1C5A",      // texto violeta oscuro
      fontWeight: "600",
    },
    iconTheme: {
      primary: "#D4AF37", // dorado
      secondary: "#fff",
    },
  });

export const notifyError = (message: string) =>
  toast.error(message, {
    style: {
      background: "#EF4444", // rojo
      color: "#fff",
      fontWeight: "600",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#EF4444",
    },
  });

  export const notifyCart = (message: string) =>
  toast.success(message, {
    style: {
      background: "#D4AF37", // dorado Magnolia
      color: "#3B1C5A",      // violeta oscuro
      fontWeight: "600",
    },
    iconTheme: {
      primary: "#A78BFA", // lilac
      secondary: "#fff",
    },
  });

  export const notifyWishlist = (message: string) =>
  toast.success(message, {
    style: {
      background: "#F87171", // rojo coral para favoritos
      color: "#fff",
      fontWeight: "600",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#F87171",
    },
  });
