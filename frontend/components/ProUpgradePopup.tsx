"use client";

import { useState } from "react";
import { X, Crown, Sparkles, Check, ChevronRight, LogIn } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

type Props = {
  onClose: () => void;
  onUpgrade: () => void;
};

const benefits = [
  "ดูรายละเอียดครบทุกลุค",
  "เข้าถึงทุกสไตล์ไม่จำกัด",
  "บันทึก Outfit ลง Moodboard",
];

export default function ProUpgradePopup({ onClose, onUpgrade }: Props) {
  const { user } = useAuth();
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const handleUpgrade = () => {
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    onUpgrade();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

      {showLoginAlert ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-brand" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">กรุณาเข้าสู่ระบบ</h3>
          <p className="text-gray-500 mb-6">คุณต้องเข้าสู่ระบบก่อนจึงจะสมัครแพ็กเกจ Pro ได้</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
              ยกเลิก
            </button>
            <a href="/login" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand to-[#D4956A] text-white font-semibold hover:shadow-lg transition-all text-center">
              เข้าสู่ระบบ
            </a>
          </div>
        </div>
      ) : (<>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-brand to-[#D4956A] p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-yellow-300 fill-yellow-300" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">อัปเกรดเป็น Pro</h2>
          <p className="text-white/80 text-sm">ปลดล็อค Outfit ทั้งหมด</p>
        </div>

        {/* Benefits */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700">{b}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-brand to-[#D4956A] text-white font-bold text-base hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            เริ่มทดลองใช้ฟรี 7 วัน
            <ChevronRight className="w-5 h-5" />
          </button>

          <button onClick={onClose} className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ไว้ทีหลัง
          </button>
        </div>
      </>)}
      </div>
    </div>
  );
}
