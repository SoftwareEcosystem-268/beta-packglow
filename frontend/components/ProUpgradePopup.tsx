"use client";

import { X, Crown, Sparkles, Check, ChevronRight } from "lucide-react";

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
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
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
            onClick={onUpgrade}
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
      </div>
    </div>
  );
}
