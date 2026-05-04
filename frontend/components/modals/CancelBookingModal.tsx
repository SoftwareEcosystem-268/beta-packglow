"use client";

import { AlertTriangle, Loader2, XCircle } from "lucide-react";

interface CancelBookingModalProps {
  target: { id: string; title: string } | null;
  cancelling: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function CancelBookingModal({ target, cancelling, onConfirm, onCancel }: CancelBookingModalProps) {
  if (!target) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-2xl p-7 w-[380px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">ยกเลิกการจอง?</h3>
        <p className="text-sm text-gray-500 text-center mb-1">คุณต้องการยกเลิก</p>
        <p className="text-base font-semibold text-gray-800 text-center mb-1">&quot;{target.title}&quot;</p>
        <p className="text-xs text-red-400 text-center mb-6">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={cancelling}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {cancelling ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "ยืนยันยกเลิก"}
          </button>
          <button onClick={onCancel} className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors">กลับ</button>
        </div>
      </div>
    </div>
  );
}
