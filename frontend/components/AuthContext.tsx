"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem("pg_current_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const signup = useCallback(async (name: string, email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.status === 400) {
        const data = await res.json();
        return data.detail === "Email already registered" ? "อีเมลนี้ถูกใช้งานแล้ว" : data.detail;
      }
      if (!res.ok) return "เกิดข้อผิดพลาด กรุณาลองใหม่";

      const data: User = await res.json();
      localStorage.setItem("pg_current_user", JSON.stringify(data));
      localStorage.setItem("pg_user_tier", "free");
      setUser(data);
      return null;
    } catch {
      return "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 401) return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      if (!res.ok) return "เกิดข้อผิดพลาด กรุณาลองใหม่";

      const data: User = await res.json();
      localStorage.setItem("pg_current_user", JSON.stringify(data));
      localStorage.setItem("pg_user_tier", "free");
      setUser(data);
      return null;
    } catch {
      return "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("pg_current_user");
    setUser(null);
  }, []);

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
