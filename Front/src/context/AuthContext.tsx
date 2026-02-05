"use client";

import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

interface User {
  id: string;
  email: string;
  isAdmin?: boolean;
  username?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  checkLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  user: null,
  login: async () => {},
  logout: () => {},
  checkLogin: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const decodeToken = (token: string): User | null => {
  try {
    const decoded: any = jwtDecode(token);
    console.log("🔍 Token decodificado:", decoded);

    // Extraer roles si vienen en el token y derivar isAdmin
    const roles: string[] = decoded.roles || [];
    const isAdminFromRoles = Array.isArray(roles) && roles.includes("admin");

    return {
      id: decoded.id,
      email: decoded.email,
      isAdmin: decoded.isAdmin ?? isAdminFromRoles,
      username: decoded.name || decoded.username || "", // nombre completo
    };
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};


const fetchProfile = async (id: string, token: string, isAdmin?: boolean) => {
  try {
    const res = await fetch(`http://localhost:4000/auth/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("No se pudo obtener el perfil");
    const profile = await res.json();
    console.log("📦 Perfil recibido:", profile);
    
    // Fusionar datos del perfil con isAdmin y id del token
    const userData = {
      ...profile,
      isAdmin,
      id,
    };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    console.error("Error al traer perfil:", error);
  }
};

  const checkLogin = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setUser(storedUser ? JSON.parse(storedUser) : decodeToken(storedToken));
    } else {
      setIsLoggedIn(false);
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  
const login = async (token: string) => {
  const decodedUser = decodeToken(token);
  console.log("🔐 Usuario decodificado:", decodedUser);

  localStorage.setItem("token", token);
  setIsLoggedIn(true);
  setToken(token);

  // Siempre traer el perfil completo del backend, pasando isAdmin desde el token
  if (decodedUser?.id) {
    console.log("📡 Llamando a /auth/profile con ID:", decodedUser.id);
    await fetchProfile(decodedUser.id, token, decodedUser.isAdmin);
  } else {
    setUser(decodedUser);
    localStorage.setItem("user", JSON.stringify(decodedUser));
  }
};



  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
