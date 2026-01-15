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
      return {
        id: decoded.id,
        email: decoded.email,
        isAdmin: decoded.isAdmin,
      };
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const fetchProfile = async (id: string, token: string) => {
    try {
      const res = await fetch(`http://localhost:4000/auth/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudo obtener el perfil");
      const profile = await res.json();
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
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
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setToken(token);

    if (decodedUser?.id) {
      await fetchProfile(decodedUser.id, token);
    } else {
      setUser(decodedUser);
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
