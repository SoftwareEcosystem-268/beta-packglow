"use client";

import { useState } from "react";
import { X, Crown, Check, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import PromptPayQR from "@/components/PromptPayQR";

type Props = {
  onClose: () => void;
  onUpgrade: () => void;
};

const PROMPTPAY_PHONE = "0950459771";

const PLANS = [
  { id: "monthly", label: "รายเดือน", price: 99, period: "/เดือน" },
  { id: "yearly", label: "รายปี", price: 499, period: "/ปี", badge: "ประหยัด 58%" },
] as const;

const benefits = [
  "ดูรายละเอียดครบทุกลุค",
  "เข้าถึงทุกสไตล์ไม่จำกัด",
  "บันทึก Outfit ลง Moodboard",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export default function ProUpgradePopup({ onClose, onUpgrade }: Props) {
  const { user } = useAuth();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[number]>(PLANS[1]);

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      const token = localStorage.getItem("pg_access_token");
      const res = await fetch(`${API_URL}/users/me/tier`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tier: "pro", plan: selectedPlan.id }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("pg_user_tier", "pro");
        if (data.subscription_expires_at) {
          localStorage.setItem("pg_subscription_expires", data.subscription_expires_at);
        }
        onUpgrade();
        onClose();
      }
    } catch {
      alert("ไม่สามารถอัปเกรดได้ กรุณาลองใหม่");
    } finally {
      setConfirming(false);
    }
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
            <a href={(process.env.NEXT_PUBLIC_BASE_PATH || "") + "/login"} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand to-[#D4956A] text-white font-semibold hover:shadow-lg transition-all text-center">
              เข้าสู่ระบบ
            </a>
          </div>
        </div>
      ) : showQR ? (
        /* QR Payment Step */
        <div className="p-6">
          <button onClick={() => setShowQR(false)} className="text-sm text-gray-400 hover:text-gray-600 mb-4">
            &larr; กลับ
          </button>
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">ชำระเงินผ่านพร้อมเพย์</h3>
            <p className="text-sm text-gray-500">สแกน QR Code เพื่อโอนเงิน ฿{selectedPlan.price}</p>
          </div>
          <div className="flex justify-center mb-5">
            <PromptPayQR phoneNumber={PROMPTPAY_PHONE} amount={selectedPlan.price} />
          </div>
          <button
            onClick={handleConfirmPayment}
            disabled={confirming}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand to-[#D4956A] text-white font-bold text-base hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {confirming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            {confirming ? "กำลังยืนยัน..." : "ฉันโอนเงินเรียบร้อยแล้ว"}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">กดปุ่มด้านบนหลังจากโอนเงินเสร็จ</p>
          <p className="text-xs text-gray-400 text-center mt-1">
            แผน{selectedPlan.label} · ใช้งาน {selectedPlan.id === "monthly" ? "30 วัน" : "365 วัน"}
          </p>
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
          <p className="text-white/80 text-sm">ปลดล็อค Outfit ทั้งหมด · เริ่มต้น ฿99/เดือน</p>
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

          {/* Plan Selection */}
          <div className="space-y-2">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`w-full p-3.5 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                  selectedPlan.id === plan.id
                    ? "border-brand bg-brand/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{plan.label}</span>
                    {"badge" in plan && plan.badge && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">฿{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan.id === plan.id ? "border-brand bg-brand" : "border-gray-300"
                }`}>
                  {selectedPlan.id === plan.id && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (!user) { setShowLoginAlert(true); return; }
              setShowQR(true);
            }}
            className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-brand to-[#D4956A] text-white font-bold text-base hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5" />
            ชำระเงินด้วยพร้อมเพย์
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
