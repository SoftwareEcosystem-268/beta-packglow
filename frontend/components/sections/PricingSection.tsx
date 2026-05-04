"use client";

import { Check, X } from "lucide-react";
import { freeFeatures, proFeatures } from "@/lib/data/pricing";

interface PricingSectionProps {
  user: { name: string; email: string } | null;
  setShowProPopup: (show: boolean) => void;
  setShowLoginAlert: (show: boolean) => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export default function PricingSection({ user, setShowProPopup, setShowLoginAlert, showToast }: PricingSectionProps) {
  return (
    <section id="pricing" className="bg-white py-10 md:py-20">
      <div className="px-4 md:px-8 lg:px-24 max-w-5xl mx-auto">
        <div className="mb-8 md:mb-12">
          <p className="text-brand text-xs md:text-sm font-medium mb-2">แผนการใช้งาน</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">เลือกแผนที่ใช่สำหรับคุณ</h2>
          <p className="text-gray-500 text-sm">เริ่มต้นฟรี อัปเกรดเมื่อพร้อม</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Free */}
          <div className="bg-[#F5F3EF] rounded-2xl p-5 md:p-8 shadow-lg">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Free</h3>
            <div className="flex items-baseline gap-1 mb-1"><span className="text-3xl md:text-4xl font-bold text-gray-900">฿0</span></div>
            <p className="text-gray-500 text-sm mb-6">ตลอดชีพ</p>
            <div className="border-t border-gray-200 pt-6 mb-6">
              <ul className="space-y-4">
                {freeFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {f.included ? <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div> : <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center"><X className="w-3 h-3 text-gray-400" /></div>}
                    <span className={f.included ? "text-gray-700" : "text-gray-400"}>{f.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => { if (!user) { setShowLoginAlert(true); return; } setShowProPopup(false); showToast("คุณอยู่ Free tier แล้ว", "success"); }} className="w-full py-3 px-6 rounded-xl border-2 border-brand text-brand font-semibold hover:bg-brand hover:text-white transition-colors">ใช้งานฟรี</button>
          </div>
          {/* Pro */}
          <div className="bg-gradient-to-br from-[#FDF0E6] to-[#F5E6D8] rounded-2xl p-5 md:p-8 shadow-lg relative">
            <div className="absolute -top-3 left-4 md:left-6 bg-brand text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-medium">ยอดนิยม</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-1"><span className="text-3xl md:text-4xl font-bold text-gray-900">฿99</span><span className="text-gray-500 text-sm">/เดือน</span><span className="text-gray-400 text-sm ml-2">หรือ ฿499/ปี</span></div>
            <p className="text-gray-500 text-sm mb-6">ประหยัด 58% เมื่อสมัครรายปี</p>
            <div className="border-t border-brand/30 pt-6 mb-6">
              <ul className="space-y-4">
                {proFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>
                    <span className="text-gray-700">{f.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => { if (!user) { setShowLoginAlert(true); return; } setShowProPopup(true); }} className="w-full py-3 px-6 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors shadow-md">อัปเกรด Pro</button>
          </div>
        </div>
      </div>
    </section>
  );
}
