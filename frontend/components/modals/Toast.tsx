"use client";

import { useEffect } from "react";

interface ToastProps {
  toast: { message: string; type: "success" | "error" } | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white font-medium text-sm z-50 transition-all ${
      toast.type === "success" ? "bg-green-600" : "bg-red-500"
    }`}>
      {toast.type === "success" && <span className="mr-2">✓</span>}
      {toast.type === "error" && <span className="mr-2">✕</span>}
      {toast.message}
    </div>
  );
}
