"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string, user?: any) => void;
  logout: () => void;
  checkLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  login: () => {},
  logout: () => {},
  checkLogin: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Función para verificar si hay token guardado
  const checkLogin = () => {
    const storedToken = localStorage.getItem("token");
    setIsLoggedIn(!!storedToken);
    setToken(storedToken);
  };

  // Se ejecuta al cargar la página por primera vez
  useEffect(() => {
    checkLogin();
  }, []);

  // Función para iniciar sesión (Guarda token y actualiza estado)
  const login = (token: string, user?: any) => {
    localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
    setToken(token);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setToken(null);
    window.location.href = "/"; // Redirige al home
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
