"use client";

import { createContext, useContext, useSyncExternalStore, useCallback, ReactNode } from "react";

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

// Cached snapshot to avoid infinite re-renders with useSyncExternalStore
let cachedUser: User | null = null;
let cachedRaw: string | null = null;

let userListeners: (() => void)[] = [];

function subscribeUser(callback: () => void) {
  userListeners = [...userListeners, callback];
  return () => {
    userListeners = userListeners.filter((l) => l !== callback);
  };
}

function getUserSnapshot(): User | null {
  try {
    const raw = localStorage.getItem("pg_current_user");
    if (raw === cachedRaw) return cachedUser;
    cachedRaw = raw;
    cachedUser = raw ? JSON.parse(raw) : null;
    return cachedUser;
  } catch {
    cachedRaw = null;
    cachedUser = null;
    return null;
  }
}

const getUserServerSnapshot = (): User | null => null;

function emitUserChange() {
  cachedRaw = null; // invalidate cache
  for (const l of userListeners) l();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribeUser, getUserSnapshot, getUserServerSnapshot);

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
      emitUserChange();
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
      emitUserChange();
      return null;
    } catch {
      return "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("pg_current_user");
    emitUserChange();
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
