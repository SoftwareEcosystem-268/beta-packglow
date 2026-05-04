"use client";

import { LogIn } from "lucide-react";

interface LoginAlertModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginAlertModal({ open, onClose }: LoginAlertModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl p-8 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-brand" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">กรุณาเข้าสู่ระบบ</h3>
        <p className="text-gray-500 mb-6">คุณต้องเข้าสู่ระบบก่อนจึงจะสมัครแพ็กเกจ Pro ได้</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
            ยกเลิก
          </button>
          <a href={(process.env.NEXT_BASE_PATH || "") + "/login"} className="flex-1 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors text-center">
            เข้าสู่ระบบ
          </a>
        </div>
      </div>
    </div>
  );
}
