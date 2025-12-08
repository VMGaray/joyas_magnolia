"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string, user?: any) => void;
  logout: () => void;
  checkLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  checkLogin: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Función para verificar si hay token guardado
  const checkLogin = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Si hay token es true, si no es false
  };

  // Se ejecuta al cargar la página por primera vez
  useEffect(() => {
    checkLogin();
  }, []);

  // Función para iniciar sesión (Guarda token y actualiza estado)
  const login = (token: string, user?: any) => {
    localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true); // ¡Aquí avisa a toda la app que entramos!
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false); // ¡Aquí avisa que salimos!
    window.location.href = "/"; // Redirige al home
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};