"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorFallbackProps {
  error: Error | null;
  reset?: () => void;
}

export default function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">เกิดข้อผิดพลาดในส่วนนี้</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">
        {error?.message || "ไม่สามารถแสดงข้อมูลได้ กรุณาลองใหม่"}
      </p>
      {reset && (
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors text-sm"
        >
          ลองใหม่
        </button>
      )}
    </div>
  );
}
