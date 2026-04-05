"use client";

import { PackingProvider } from "@/components/PackingContext";
import { AuthProvider } from "@/components/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PackingProvider>
        {children}
      </PackingProvider>
    </AuthProvider>
  );
}
