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
  login: (token: string) => void;
  logout: () => void;
  checkLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  user: null,
  login: () => {},
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

  const checkLogin = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodedUser = decodeToken(storedToken);
      setIsLoggedIn(true);
      setToken(storedToken);
      setUser(decodedUser);
    } else {
      setIsLoggedIn(false);
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const login = (token: string) => {
    const decodedUser = decodeToken(token);
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setToken(token);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
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
