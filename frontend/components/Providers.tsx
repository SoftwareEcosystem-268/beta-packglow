"use client";

import { PackingProvider } from "@/components/PackingContext";
import { AuthProvider } from "@/components/AuthContext";
import { TripProvider } from "@/components/TripContext";
import { OutfitProvider } from "@/components/OutfitContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TripProvider>
        <OutfitProvider>
          <PackingProvider>
            {children}
          </PackingProvider>
        </OutfitProvider>
      </TripProvider>
    </AuthProvider>
  );
}
