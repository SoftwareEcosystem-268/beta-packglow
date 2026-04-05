"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  signup: (name: string, email: string, password: string) => string | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pg_current_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const getUsers = (): Record<string, { name: string; password: string }> => {
    try { return JSON.parse(localStorage.getItem("pg_users") || "{}"); } catch { return {}; }
  };

  const signup = (name: string, email: string, password: string): string | null => {
    const users = getUsers();
    if (users[email]) return "อีเมลนี้ถูกใช้งานแล้ว";
    if (password.length < 8) return "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    users[email] = { name, password };
    localStorage.setItem("pg_users", JSON.stringify(users));
    const newUser: User = { name, email };
    localStorage.setItem("pg_current_user", JSON.stringify(newUser));
    setUser(newUser);
    return null;
  };

  const login = (email: string, password: string): string | null => {
    const users = getUsers();
    if (!users[email]) return "ไม่พบบัญชีนี้";
    if (users[email].password !== password) return "รหัสผ่านไม่ถูกต้อง";
    const loggedUser: User = { name: users[email].name, email };
    localStorage.setItem("pg_current_user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    return null;
  };

  const logout = () => {
    localStorage.removeItem("pg_current_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
