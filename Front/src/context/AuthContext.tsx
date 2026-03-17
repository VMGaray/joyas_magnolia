"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

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
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  checkLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  checkLogin: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token: string): User | null => {
    try {
      const decoded: any = jwtDecode(token);
      const roles: string[] = decoded.roles || [];
      const isAdminFromRoles = Array.isArray(roles) && roles.includes("admin");

      return {
        id: decoded.id,
        email: decoded.email,
        isAdmin: decoded.isAdmin ?? isAdminFromRoles,
        username: decoded.name || decoded.username || "",
      };
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const fetchProfile = async (id: string, token: string, isAdmin?: boolean) => {
    try {
      const res = await fetch(`http://localhost:4000/auth/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo obtener el perfil");
      const profile = await res.json();
      
      const userData = { ...profile, isAdmin, id };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      const fallbackUser = { id, email: "", isAdmin, username: "" };
      setUser(fallbackUser);
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  };

  const checkLogin = () => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (storedToken) {
        setIsLoggedIn(true);
        setToken(storedToken);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(decodeToken(storedToken));
        }
      }
    } catch (err) {
      console.error("Error en checkLogin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const login = async (token: string) => {
    setLoading(true);
    const decodedUser = decodeToken(token);

    localStorage.setItem("token", token);
    setToken(token);
    setIsLoggedIn(true);

    if (decodedUser?.id) {
      await fetchProfile(decodedUser.id, token, decodedUser.isAdmin);
    } else {
      setUser(decodedUser);
      localStorage.setItem("user", JSON.stringify(decodedUser));
    }
    setLoading(false);
  };

  const logout = () => {
    // ✅ NO usamos localStorage.clear(). Borramos solo lo necesario.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, loading, login, logout, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};