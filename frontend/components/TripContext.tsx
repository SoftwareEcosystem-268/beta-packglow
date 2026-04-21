"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Trip, getTrips, createTrip, deleteTrip } from "@/lib/api";

type TripContextType = {
  trips: Trip[];
  loading: boolean;
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
  createNewTrip: (data: Omit<Trip, "id" | "created_at" | "updated_at">) => Promise<Trip | null>;
  removeTrip: (tripId: string) => Promise<void>;
  refreshTrips: () => Promise<void>;
};

const TripContext = createContext<TripContextType | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTrip, setCurrentTripState] = useState<Trip | null>(null);

  // Hydrate currentTrip from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pg_current_trip");
      if (saved) setCurrentTripState(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist currentTrip to localStorage
  useEffect(() => {
    if (currentTrip) {
      localStorage.setItem("pg_current_trip", JSON.stringify(currentTrip));
    } else {
      localStorage.removeItem("pg_current_trip");
    }
  }, [currentTrip]);

  const setCurrentTrip = useCallback((trip: Trip | null) => {
    setCurrentTripState(trip);
  }, []);

  const refreshTrips = useCallback(async () => {
    if (!user) {
      setTrips([]);
      setLoading(false);
      return;
    }
    try {
      const data = await getTrips(user.id);
      setTrips(data);
      setCurrentTripState((prev) => {
        if (prev) {
          const stillExists = data.some((t) => t.id === prev.id);
          return stillExists ? prev : (data.length > 0 ? data[0] : null);
        }
        return data.length > 0 ? data[0] : null;
      });
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  const createNewTrip = useCallback(async (data: Omit<Trip, "id" | "created_at" | "updated_at">) => {
    try {
      const trip = await createTrip(data);
      setTrips((prev) => [...prev, trip]);
      return trip;
    } catch (e) {
      console.error("[TripContext] createNewTrip failed:", e);
      return null;
    }
  }, []);

  const removeTrip = useCallback(async (tripId: string) => {
    try {
      await deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      setCurrentTripState((prev) => (prev?.id === tripId ? null : prev));
    } catch {}
  }, []);

  return (
    <TripContext.Provider value={{ trips, loading, currentTrip, setCurrentTrip, createNewTrip, removeTrip, refreshTrips }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrips must be used within a TripProvider");
  return context;
}
