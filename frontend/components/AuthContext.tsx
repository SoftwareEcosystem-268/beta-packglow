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
let cacheVersion = 0;
let readVersion = -1;

let userListeners: (() => void)[] = [];


function subscribeUser(callback: () => void) {
  userListeners = [...userListeners, callback];
  return () => {
    userListeners = userListeners.filter((l) => l !== callback);
  };
}

function getUserSnapshot(): User | null {
  if (cacheVersion === readVersion) return cachedUser;
  readVersion = cacheVersion;
  try {
    const raw = localStorage.getItem("pg_current_user");
    cachedUser = raw ? JSON.parse(raw) : null;
    return cachedUser;
  } catch {
    cachedUser = null;
    return null;
  }
}

const getUserServerSnapshot = (): User | null => null;

function emitUserChange() {
  cacheVersion++;
  for (const l of userListeners) l();
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pg_access_token");
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

      const data = await res.json();
      localStorage.setItem("pg_access_token", data.access_token);
      localStorage.setItem("pg_current_user", JSON.stringify(data.user));
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

      const data = await res.json();
      localStorage.setItem("pg_access_token", data.access_token);
      localStorage.setItem("pg_current_user", JSON.stringify(data.user));
      localStorage.setItem("pg_user_tier", "free");
      emitUserChange();
      return null;
    } catch {
      return "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("pg_access_token");
    localStorage.removeItem("pg_current_user");
    localStorage.removeItem("pg_user_tier");
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
